<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../src/helpers.php';
require_once __DIR__ . '/../config/db.php';

// Autoload simple para nuestras clases (App\*)
spl_autoload_register(function ($class) {
  $prefix = 'App\\';
  if (str_starts_with($class, $prefix)) {
    $rel = substr($class, strlen($prefix));
    $path = __DIR__ . '/../src/' . str_replace('\\', '/', $rel) . '.php';
    if (is_file($path)) {
      require_once $path;
    }
  }
});

use App\Controller\HealthController;
use App\Controller\ItemsController;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Ajuste si el proyecto vive en subcarpeta (ej: /prog3/public)
$base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
if ($base !== '' && str_starts_with($uri, $base)) {
  $uri = substr($uri, strlen($base)) ?: '/';
}

try {
  if ($method === 'GET' && $uri === '/health') {
    (new HealthController())->show();
    exit;
  }

  if ($method === 'GET' && $uri === '/items') {
    (new ItemsController())->index();
    exit;
  }

  // Semana 4: API JSON consumida desde fetch (sin CORS, mismo host)
  if ($method === 'GET' && $uri === '/api/items') {
    (new ItemsController())->apiIndex();
    exit;
  }

  if ($method === 'POST' && $uri === '/api/items') {
    (new ItemsController())->apiCreate();
    exit;
  }

  if ($method === 'GET' && $uri === '/items/new') {
    (new ItemsController())->newForm();
    exit;
  }

  if ($method === 'POST' && $uri === '/items') {
    (new ItemsController())->create();
    exit;
  }

  response_json(['ok' => false, 'err' => 'Ruta no encontrada', 'path' => $uri, 'method' => $method], 404);
} catch (Throwable $e) {
  response_json(['ok' => false, 'err' => 'Error interno'], 500);
}
