<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Item;

class ItemsController {

  public function newForm(): void {
    header('Content-Type: text/html; charset=utf-8');
    echo '<h2>Alta de Item</h2>
      <p><a href="items_ui.html">Ir a la UI (fetch)</a></p>
      <form method="POST" action="api/items" style="max-width:360px">
        <label>Nombre</label><br>
        <input name="name" /><br><br>
        <label>Cantidad</label><br>
        <input name="qty" /><br><br>
        <button type="submit">Guardar</button>
      </form>
      <p>Nota: este POST apunta al endpoint API y enviará form-encoded; la UI usa JSON con fetch.</p>';
  }

  public function apiIndex(): void {
    $items = Item::orderBy('id','desc')->get()->toArray();
    response_json(['ok'=>true,'items'=>$items], 200);
  }

  public function apiCreate(): void {
    // API: espera JSON
    $payload = read_json_body();
    $name = trim((string)($payload['name'] ?? ''));
    $qtyRaw = $payload['qty'] ?? null;

    $errors = [];
    if ($name === '' || mb_strlen($name) < 3) $errors['name'] = 'Nombre requerido (mínimo 3 caracteres).';

    // qty debe ser entero >= 0
    $qty = null;
    if (is_int($qtyRaw)) {
      $qty = $qtyRaw;
    } elseif (is_string($qtyRaw) && ctype_digit($qtyRaw)) {
      $qty = (int)$qtyRaw;
    }
    if ($qty === null || $qty < 0) $errors['qty'] = 'Cantidad requerida (entero >= 0).';

    // TODO PARCIAL: validación de duplicados por name (case-insensitive y trim)
    // Si existe duplicado: $errors['name'] = 'Ya existe un item con ese nombre.';

    if ($errors) {
      response_json(['ok'=>false,'errors'=>$errors], 400);
      return;
    }

    $item = Item::create(['name'=>$name, 'qty'=>$qty]);
    response_json(['ok'=>true,'item'=>$item->toArray()], 201);
  }

  public function apiStats(): void {
    // TODO PARCIAL: implementar count y total_qty desde DB.
    // Debe responder 200 con { ok:true, stats:{ count:..., total_qty:... } }
    response_json(['ok'=>false,'err'=>'TODO PARCIAL: implementar /api/items/stats'], 501);
  }
}
