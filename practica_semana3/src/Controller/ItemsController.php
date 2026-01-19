<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Item;

class ItemsController {

  public function newForm(): void {
    header('Content-Type: text/html; charset=utf-8');

    echo '<!doctype html><html><head><meta charset="utf-8"><title>Alta Item</title></head><body>';
    echo '<h2>Alta de Item</h2>';
    echo '<p><a href="items">Ver listado (JSON)</a></p>';

    echo '<form method="POST" action="items">';
    echo '<label>Nombre</label><br><input name="name" /><br><br>';
    echo '<label>Cantidad</label><br><input name="qty" value="0" /><br><br>';
    echo '<button type="submit">Guardar</button>';
    echo '</form>';
    echo '<hr><p>Tip: probá errores enviando nombre vacío o cantidad no numérica.</p>';
    echo '</body></html>';
  }

  public function index(): void {
    $items = Item::orderBy('id', 'desc')->get()->toArray();
    response_json(['ok' => true, 'items' => $items], 200);
  }

  public function create(): void {
    $name = trim((string)($_POST['name'] ?? ''));
    $qtyRaw = trim((string)($_POST['qty'] ?? ''));

    $errors = [];
    if ($name === '' || strlen($name) < 3) $errors['name'] = 'Nombre requerido (mínimo 3 caracteres).';
    if ($qtyRaw === '' || !ctype_digit($qtyRaw)) $errors['qty'] = 'Cantidad requerida (entero >= 0).';

    if ($errors) {
      response_json(['ok' => false, 'errors' => $errors], 400);
      return;
    }

    $item = Item::create(['name' => $name, 'qty' => (int)$qtyRaw]);
    response_json(['ok' => true, 'item' => $item->toArray()], 201);
  }
}
