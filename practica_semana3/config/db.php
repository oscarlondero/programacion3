<?php
declare(strict_types=1);

// Bootstrap Eloquent (standalone, sin framework)
// Requiere ejecutar: composer install

$autoload = __DIR__ . '/../vendor/autoload.php';
if (!is_file($autoload)) {
  http_response_code(500);
  header('Content-Type: text/plain; charset=utf-8');
  echo "Falta vendor/autoload.php.\n\nEn la raiz del proyecto ejecuta: composer install\n";
  exit;
}

require_once $autoload;

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule();

// Configuracion DB (XAMPP default)
$capsule->addConnection([
  'driver'    => 'mysql',
  'host'      => '127.0.0.1',
  'database'  => 'prog3',
  'username'  => 'root',
  'password'  => '',
  'charset'   => 'utf8mb4',
  'collation' => 'utf8mb4_unicode_ci',
  'prefix'    => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
