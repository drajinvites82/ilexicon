<?php
// iLexicon contact form handler. Shipped from public/ by the Astro build.
// Accepts the POST from ContactForm.astro, validates, sends one email to TO, returns JSON.
declare(strict_types=1);

const TO        = 'ideas@ilexicon.com';
const FROM      = 'noreply@ilexicon.com';
const FROM_NAME = 'ilexicon.com';
const MAX_MSG   = 5000;
// Must match the <option> values in src/components/ContactForm.astro.
const INTERESTS = ['AI & automation', 'Custom development', 'Data & integration', 'Team augmentation', 'Not sure yet'];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $body): never {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// Same-origin only. Browsers send Origin on fetch POSTs; fall back to Referer for the no-JS path.
$host   = strtolower($_SERVER['HTTP_HOST'] ?? '');
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
if ($origin !== '' && strtolower((string) parse_url($origin, PHP_URL_HOST)) !== $host) {
    respond(403, ['ok' => false, 'error' => 'forbidden']);
}

// Honeypot: bots fill it, humans never see it. Pretend success so the bot moves on.
if (!empty($_POST['_gotcha'])) {
    respond(200, ['ok' => true]);
}

// Single-line fields: strip CR/LF so nothing can inject headers.
$line = static fn(string $k): string => trim(str_replace(["\r", "\n"], ' ', (string) ($_POST[$k] ?? '')));
$name     = $line('name');
$email    = $line('email');
$company  = $line('company');
$interest = $line('interest');
$message  = trim((string) ($_POST['message'] ?? ''));

$errors = [];
if ($name === '' || mb_strlen($name) > 200)                 $errors['name']     = 'This field is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))             $errors['email']    = 'Enter a full email address, like name@company.com.';
if (!in_array($interest, INTERESTS, true))                  $errors['interest'] = 'This field is required.';
if ($message === '' || mb_strlen($message) > MAX_MSG)       $errors['message']  = 'This field is required.';
if (mb_strlen($company) > 200)                              $errors['company']  = 'Keep this under 200 characters.';
if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors]);
}

$subject = 'iLexicon enquiry: ' . $interest;
$body = "Name: {$name}\n"
      . "Email: {$email}\n"
      . "Company: " . ($company !== '' ? $company : '—') . "\n"
      . "Looking for: {$interest}\n"
      . "\n{$message}\n"
      . "\n—\nSent from the ilexicon.com contact form\n"
      . "Time: " . gmdate('Y-m-d H:i') . " UTC\n"
      . "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers = implode("\r\n", [
    'From: ' . mb_encode_mimeheader(FROM_NAME, 'UTF-8') . ' <' . FROM . '>',
    'Reply-To: ' . mb_encode_mimeheader($name, 'UTF-8') . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: ilexicon-contact',
]);

$sent = mail(TO, mb_encode_mimeheader($subject, 'UTF-8'), $body, $headers, '-f ' . FROM);

$sent ? respond(200, ['ok' => true])
      : respond(500, ['ok' => false, 'error' => 'send_failed']);
