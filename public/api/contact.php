<?php
/**
 * Aftech contact form endpoint.
 * Runs on Hostinger PHP hosting. Not executable/testable locally (no PHP runtime in this build environment) —
 * verify manually after upload to public_html/api/contact.php.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

// ---- config (edit before deploy) --------------------------------------
$RECIPIENT_EMAIL = 'aftech.daya@gmail.com';
$RATE_LIMIT_WINDOW_SECONDS = 60;
$RATE_LIMIT_MAX_REQUESTS = 5;
$RATE_LIMIT_DIR = sys_get_temp_dir() . '/aftech_contact_rate';
// -------------------------------------------------------------------------

function jsonResponse(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// --- naive per-IP rate limiting -----------------------------------------
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!is_dir($RATE_LIMIT_DIR)) {
    @mkdir($RATE_LIMIT_DIR, 0700, true);
}
$rateFile = $RATE_LIMIT_DIR . '/' . preg_replace('/[^a-zA-Z0-9_.]/', '_', $ip) . '.json';
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $raw = file_get_contents($rateFile);
    $decoded = $raw !== false ? json_decode($raw, true) : null;
    if (is_array($decoded)) {
        $hits = $decoded;
    }
}
$hits = array_values(array_filter($hits, fn ($t) => $now - $t < $RATE_LIMIT_WINDOW_SECONDS));
if (count($hits) >= $RATE_LIMIT_MAX_REQUESTS) {
    jsonResponse(429, ['ok' => false, 'error' => 'Too many requests, please try again shortly.']);
}
$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits));

// --- read + validate input ------------------------------------------------
$body = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($body)) {
    $body = $_POST;
}

// honeypot — bots fill hidden fields, humans don't
if (!empty($body['company_website'] ?? '')) {
    jsonResponse(200, ['ok' => true]); // silently accept, do nothing
}

function cleanString(mixed $value, int $maxLen = 2000): string
{
    $value = is_string($value) ? $value : '';
    $value = trim($value);
    $value = preg_replace('/[\r\n]+/', ' ', $value) ?? '';
    return mb_substr($value, 0, $maxLen);
}

$fullName = cleanString($body['fullName'] ?? '', 120);
$company = cleanString($body['company'] ?? '', 120);
$email = cleanString($body['email'] ?? '', 200);
$phone = cleanString($body['phone'] ?? '', 40);
$projectType = cleanString($body['projectType'] ?? '', 60);
$budgetRange = cleanString($body['budgetRange'] ?? '', 60);
$location = cleanString($body['location'] ?? '', 120);
$timeline = cleanString($body['timeline'] ?? '', 60);
$message = cleanString($body['message'] ?? '', 4000);

$errors = [];
if ($fullName === '') $errors['fullName'] = 'Full name is required.';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'A valid email is required.';
if ($projectType === '') $errors['projectType'] = 'Project type is required.';
if (mb_strlen($message) < 10) $errors['message'] = 'Message must be at least 10 characters.';

if (!empty($errors)) {
    jsonResponse(422, ['ok' => false, 'errors' => $errors]);
}

// --- compose + send (headers built from sanitized values only) ----------
$subject = 'New project inquiry from ' . $fullName;
$lines = [
    "Full Name: $fullName",
    "Company: $company",
    "Email: $email",
    "Phone: $phone",
    "Project Type: $projectType",
    "Budget Range: $budgetRange",
    "Location: $location",
    "Timeline: $timeline",
    '',
    'Message:',
    $message,
];
$textBody = implode("\n", $lines);

$headers = [];
$headers[] = 'From: no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'aftech.co.id');
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = @mail($RECIPIENT_EMAIL, $subject, $textBody, implode("\r\n", $headers));

if (!$sent) {
    jsonResponse(500, ['ok' => false, 'error' => 'Could not send message. Please try again later.']);
}

jsonResponse(200, ['ok' => true]);
