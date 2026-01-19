<?php
declare(strict_types=1);

namespace App\Controller;

class HealthController {
  public function show(): void {
    response_json([
      'ok'  => true,
      'time'=> date('c'),
      'php' => PHP_VERSION,
    ], 200);
  }
}
