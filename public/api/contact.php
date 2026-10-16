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
// Envelope sender — must be on our own domain so SPF/DMARC can align.
// (Without this, PHP mail() sends from the server hostname, SPF fails,
// DMARC fails, and Gmail files the message as spam.)
$ENVELOPE_FROM = 'no-reply@aftech.co.id';
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
$errors = [];
if ($fullName === '') $errors['fullName'] = 'Full name is required.';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'A valid email is required.';

if (($body['kind'] ?? '') === 'demo') {
    // Demo request from a product page (src/components/products/DemoRequestForm.tsx).
    $product = cleanString($body['product'] ?? '', 80);
    $jobTitle = cleanString($body['jobTitle'] ?? '', 120);
    $preferredDate = cleanString($body['preferredDate'] ?? '', 10);
    $preferredTime = cleanString($body['preferredTime'] ?? '', 40);
    $format = ($body['format'] ?? '') === 'onsite' ? 'Tatap muka di kantor klien' : 'Online (video call)';
    $plan = cleanString($body['plan'] ?? '', 60);
    $notes = cleanString($body['notes'] ?? '', 2000);

    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $preferredDate, new DateTimeZone('Asia/Jakarta'));
    if ($product === '') $errors['product'] = 'Product is required.';
    if ($company === '') $errors['company'] = 'Company is required.';
    if (strlen(preg_replace('/\D/', '', $phone) ?? '') < 8) $errors['phone'] = 'A valid phone number is required.';
    if (!$date || $date->format('Y-m-d') !== $preferredDate) $errors['preferredDate'] = 'A valid date is required.';
    if ($preferredTime === '') $errors['preferredTime'] = 'A time slot is required.';

    $subject = "Permintaan demo $product — $fullName ($company)";
    $days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    $dateLabel = $date ? $days[(int) $date->format('w')] . ', ' . $date->format('d-m-Y') : $preferredDate;
    $lines = [
        "Produk: $product",
        "Paket yang diminati: " . ($plan !== '' ? $plan : 'Belum tahu'),
        '',
        "Jadwal yang diminta: $dateLabel, $preferredTime",
        "Format: $format",
        '',
        "Nama: $fullName",
        "Perusahaan / instansi: $company",
        "Jabatan: $jobTitle",
        "Email: $email",
        "WhatsApp: $phone",
        '',
        'Catatan:',
        $notes !== '' ? $notes : '-',
        '',
        'Konfirmasi jadwal ke pemohon lewat WhatsApp atau email.',
    ];
} else {
    $projectType = cleanString($body['projectType'] ?? '', 60);
    $budgetRange = cleanString($body['budgetRange'] ?? '', 60);
    $location = cleanString($body['location'] ?? '', 120);
    $timeline = cleanString($body['timeline'] ?? '', 60);
    $message = cleanString($body['message'] ?? '', 4000);

    if ($projectType === '') $errors['projectType'] = 'Project type is required.';
    if (mb_strlen($message) < 10) $errors['message'] = 'Message must be at least 10 characters.';

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
}

if (!empty($errors)) {
    jsonResponse(422, ['ok' => false, 'errors' => $errors]);
}

// --- compose + send (headers built from sanitized values only) ----------
$textBody = implode("\n", $lines);

$headers = [];
$headers[] = 'From: no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'aftech.co.id');
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Date: ' . date(DATE_RFC2822);
// Explicit Message-ID on our own domain — the server-generated one uses the
// shared hostname, another spam signal for Gmail.
$headers[] = 'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . ($_SERVER['SERVER_NAME'] ?? 'aftech.co.id') . '>';

// Pass the envelope sender (-f) so the SPF check runs against OUR domain
// (whose SPF authorizes Hostinger) instead of the shared server hostname.
// Falls back to plain mail() if the host rejects the -f parameter.
$envelope = '-f' . $ENVELOPE_FROM;
// Names and the demo subject can carry non-ASCII characters; headers must be MIME-encoded.
$subject = mb_encode_mimeheader($subject, 'UTF-8', 'B');
$sent = @mail($RECIPIENT_EMAIL, $subject, $textBody, implode("\r\n", $headers), $envelope);
if (!$sent) {
    $sent = @mail($RECIPIENT_EMAIL, $subject, $textBody, implode("\r\n", $headers));
}

if (!$sent) {
    jsonResponse(500, ['ok' => false, 'error' => 'Could not send message. Please try again later.']);
}

jsonResponse(200, ['ok' => true]);
