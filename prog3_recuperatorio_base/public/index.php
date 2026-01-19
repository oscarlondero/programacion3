<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../src/helpers.php';

// Composer autoload (requerido para Eloquent)
$autoload = __DIR__ . '/../vendor/autoload.php';
if (is_file($autoload)) {
  require_once $autoload;
}

// DB bootstrap (requiere vendor)
if (is_file(__DIR__ . '/../config/db.php')) {
  require_once __DIR__ . '/../config/db.php';
}

use App\Controller\HealthController;
use App\Controller\ItemsController;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Ajuste si el proyecto está en subcarpeta, ej: /prog3_parcial1/public/...
$base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
if ($base !== '' && $base !== '/' && str_starts_with($uri, $base)) {
  $uri = substr($uri, strlen($base)) ?: '/';
}

try {
  // Health
  if ($method === 'GET' && $uri === '/health') {
    (new HealthController())->show();
    exit;
  }

  // Form simple
  if ($method === 'GET' && $uri === '/items/new') {
    (new ItemsController())->newForm();
    exit;
  }

  // API Items
  if ($method === 'GET' && $uri === '/api/items') {
    (new ItemsController())->apiIndex();
    exit;
  }

  if ($method === 'POST' && $uri === '/api/items') {
    (new ItemsController())->apiCreate();
    exit;
  }

  if ($method === 'GET' && $uri === '/api/items/latest') {
    (new ItemsController())->apiLatest();
    exit;
  }

  // 404
  response_json(['ok'=>false,'err'=>'Ruta no encontrada','path'=>$uri], 404);
} catch (Throwable $e) {
  // Para el parcial evitamos filtrar detalles en JSON.
  response_json(['ok'=>false,'err'=>'Error interno'], 500);
}
