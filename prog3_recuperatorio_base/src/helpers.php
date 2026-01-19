<?php
declare(strict_types=1);

function response_json(array $data, int $code = 200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
}

function read_json_body(): array {
  $raw = (string)file_get_contents('php://input');
  if ($raw === '') return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function h(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
