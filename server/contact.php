<?php
/**
 * contact.php — Manejador del formulario de contacto de GAMA Seguridad Integral.
 * No usa servicios de terceros: corre en el hosting propio (Nuthost) y envía
 * el mail directo con la funcion mail() de PHP.
 *
 * Subir este archivo a un subdominio con PHP en el hosting de Nuthost
 * (por ejemplo https://form.seguridadgama.com.ar/contact.php) y apuntar
 * ahí el fetch() del formulario en assets/js/main.js.
 */

// No exponer detalles de errores de PHP en la respuesta (el hosting compartido
// puede traer display_errors activado por defecto).
ini_set('display_errors', '0');
error_reporting(0);

$allowedOrigins = ['https://seguridadgama.com.ar', 'https://www.seguridadgama.com.ar'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originAllowed = in_array($origin, $allowedOrigins, true);
if ($originAllowed) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

// CORS solo controla si el navegador deja LEER la respuesta; no evita que un
// bot mande el POST directo sin pasar por el navegador. Exigir un Origin
// válido corta la mayoría de ese abuso automatizado.
if (!$originAllowed) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Origen no permitido']);
    exit;
}

function clean_field($value, $maxLength = 200) {
    $value = trim((string) $value);
    $value = preg_replace('/[\r\n]+/', ' ', $value);
    return mb_substr($value, 0, $maxLength);
}

$nombre   = clean_field($_POST['nombre'] ?? '', 100);
$telefono = clean_field($_POST['telefono'] ?? '', 40);
$email    = clean_field($_POST['email'] ?? '', 150);
$servicio = clean_field($_POST['servicio'] ?? '', 100);
$mensaje  = mb_substr(trim((string) ($_POST['mensaje'] ?? '')), 0, 3000);
$honeypot = trim((string) ($_POST['sitio_web'] ?? '')); // campo oculto anti-spam

// Si el honeypot viene completo, es un bot: respondemos "ok" sin enviar nada.
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($nombre === '' || $telefono === '' || $email === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Faltan datos obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Email inválido']);
    exit;
}

$to      = 'info@seguridadgama.com.ar';
$subject = '=?UTF-8?B?' . base64_encode('Nueva consulta desde la web — ' . $nombre) . '?=';

$body  = "Nueva consulta recibida desde seguridadgama.com.ar\n\n";
$body .= "Nombre: $nombre\n";
$body .= "Teléfono: $telefono\n";
$body .= "Email: $email\n";
$body .= "Servicio de interés: " . ($servicio !== '' ? $servicio : '(no especificado)') . "\n\n";
$body .= "Mensaje:\n" . ($mensaje !== '' ? $mensaje : '(sin mensaje)') . "\n";

$headers   = [];
$headers[] = 'From: Formulario Web GAMA <info@seguridadgama.com.ar>';
$headers[] = "Reply-To: $email";
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el correo']);
}
