<?php
/**
 * Thumbs up / down on chat assistant answers.
 *
 * Appends one JSON line per rating to aftech-chat-feedback.jsonl one level
 * ABOVE public_html, so the log is never web-readable. Each line holds the
 * time, rating, language, the visitor's question and the assistant's answer —
 * no IP address or other identifier.
 *
 * Kept PHP 7.4-compatible so it can be exercised locally with `php -S`.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

// ---- config -------------------------------------------------------------
$LOG_FILE = dirname(__DIR__, 2) . '/aftech-chat-feedback.jsonl';
$DAILY_MAX_PER_IP = 40;
$RATE_LIMIT_DIR = sys_get_temp_dir() . '/aftech_chat_rate';
// -------------------------------------------------------------------------

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$body = json_decode(file_get_contents('php://input') ?: '', true);
$rating = is_array($body) ? ($body['rating'] ?? '') : '';
if (!in_array($rating, ['up', 'down'], true)) {
    respond(400, ['ok' => false, 'error' => 'bad_request']);
}
$text = function ($value, int $max): string {
    return is_string($value) ? mb_substr(trim($value), 0, $max) : '';
};

// Same forwarded-address handling as chat.php (the site is behind a CDN).
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$forwarded = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''))[0]);
if ($forwarded !== '' && filter_var($forwarded, FILTER_VALIDATE_IP)) {
    $ip = $forwarded;
}
if (!is_dir($RATE_LIMIT_DIR)) {
    @mkdir($RATE_LIMIT_DIR, 0700, true);
}
$today = date('Ymd');
$counterFile = $RATE_LIMIT_DIR . '/fb-' . preg_replace('/[^a-zA-Z0-9_.]/', '_', $ip) . '.json';
$fh = @fopen($counterFile, 'c+');
if ($fh !== false) {
    flock($fh, LOCK_EX);
    $d = json_decode((string) stream_get_contents($fh), true);
    $count = is_array($d) && ($d['day'] ?? '') === $today ? (int) ($d['count'] ?? 0) : 0;
    if ($count >= $DAILY_MAX_PER_IP) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond(429, ['ok' => false, 'error' => 'rate_limited']);
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode(['day' => $today, 'count' => $count + 1]));
    flock($fh, LOCK_UN);
    fclose($fh);
}

$line = json_encode([
    'at' => date('c'),
    'rating' => $rating,
    'lang' => ($body['lang'] ?? '') === 'en' ? 'en' : 'id',
    'question' => $text($body['question'] ?? null, 500),
    'answer' => $text($body['answer'] ?? null, 2500),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";

if (@file_put_contents($LOG_FILE, $line, FILE_APPEND | LOCK_EX) === false) {
    error_log('aftech chat feedback: cannot write ' . $LOG_FILE);
}

respond(200, ['ok' => true]);
