<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Item;
use App\Model\Category;

class ItemsController {

  /**
   * Reglas de validación del ejemplo base.
   * Devuelve array de errores (vacío si OK) y el qty parseado.
   */
  private function validate(string $name, string $qtyRaw, ?string $categoryIdRaw, ?int &$qtyOut = null, ?int &$categoryIdOut = null): array {
    $errors = [];
    $name = trim($name);
    $qtyRaw = trim($qtyRaw);

    $categoryIdRaw = $categoryIdRaw === null ? null : trim($categoryIdRaw);

    if ($name === '' || mb_strlen($name) < 3) {
      $errors['name'] = 'Nombre requerido (mínimo 3 caracteres).';
    }

    if ($qtyRaw === '' || !ctype_digit($qtyRaw)) {
      $errors['qty'] = 'Cantidad requerida (entero >= 0).';
    }

    // Semana 7: relación 1:N (category_id requerido y debe existir)
    if ($categoryIdRaw === null || $categoryIdRaw === '') {
      $errors['category_id'] = 'Categoría requerida.';
    } elseif (!ctype_digit($categoryIdRaw)) {
      $errors['category_id'] = 'Categoría inválida (entero).';
    } else {
      $cid = (int)$categoryIdRaw;
      if ($cid <= 0 || !Category::find($cid)) {
        $errors['category_id'] = 'Categoría inexistente.';
      } else {
        $categoryIdOut = $cid;
      }
    }

    if (!$errors) {
      $qtyOut = (int)$qtyRaw;
    }
    return $errors;
  }

  private function itemToApi(Item $it): array {
    // Evitamos devolver la relación completa para mantener el JSON simple.
    $catName = null;
    if ($it->category_id) {
      $catName = $it->category?->name;
    }
    return [
      'id' => $it->id,
      'name' => $it->name,
      'qty' => $it->qty,
      'category_id' => $it->category_id,
      'category_name' => $catName,
      'created_at' => (string)($it->created_at ?? ''),
      'updated_at' => (string)($it->updated_at ?? ''),
    ];
  }

  private function itemsToApiArray($items): array {
    $out = [];
    foreach ($items as $it) {
      $out[] = $this->itemToApi($it);
    }
    return $out;
  }

  /**
   * Lee JSON del body (API).
   */
  private function readJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode((string)$raw, true);
    return is_array($data) ? $data : [];
  }

  public function newForm(): void {
    header('Content-Type: text/html; charset=utf-8');

    $cats = Category::orderBy('name','asc')->get();

    echo '<!doctype html><html><head><meta charset="utf-8"><title>Alta Item</title></head><body>';
    echo '<h2>Alta de Item</h2>';
    echo '<p><a href="items">Ver listado (JSON)</a></p>';

    echo '<form method="POST" action="items">';
    echo '<label>Nombre</label><br><input name="name" /><br><br>';
    echo '<label>Cantidad</label><br><input name="qty" value="0" /><br><br>';
    echo '<label>Categoría</label><br><select name="category_id">';
    foreach ($cats as $c) {
      $id = (int)$c->id;
      $nm = htmlspecialchars((string)$c->name, ENT_QUOTES, 'UTF-8');
      echo "<option value=\"{$id}\">{$nm}</option>";
    }
    echo '</select><br><br>';
    echo '<button type="submit">Guardar</button>';
    echo '</form>';
    echo '<hr><p>Tip: probá errores enviando nombre vacío o cantidad no numérica.</p>';
    echo '</body></html>';
  }

  public function index(): void {
    $items = Item::with('category')->orderBy('id', 'desc')->get();
    response_json(['ok' => true, 'items' => $this->itemsToApiArray($items)], 200);
  }

  // -------- Semana 4: API JSON --------
  public function apiIndex(): void {
    $items = Item::with('category')->orderBy('id', 'desc')->get();
    response_json(['ok' => true, 'items' => $this->itemsToApiArray($items)], 200);
  }

  public function apiCreate(): void {
    $p = $this->readJsonBody();
    $name = (string)($p['name'] ?? '');
    $qtyRaw = (string)($p['qty'] ?? '');
    $categoryIdRaw = isset($p['category_id']) ? (string)$p['category_id'] : null;

    $qty = 0;
    $categoryId = 0;
    $errors = $this->validate($name, $qtyRaw, $categoryIdRaw, $qty, $categoryId);
    if ($errors) {
      response_json(['ok' => false, 'errors' => $errors], 400);
      return;
    }

    $item = Item::create(['name' => trim($name), 'qty' => $qty, 'category_id' => $categoryId]);
    $item->load('category');
    response_json(['ok' => true, 'item' => $this->itemToApi($item)], 201);
  }

  public function create(): void {
    $name = (string)($_POST['name'] ?? '');
    $qtyRaw = (string)($_POST['qty'] ?? '');
    $categoryIdRaw = isset($_POST['category_id']) ? (string)$_POST['category_id'] : null;

    $qty = 0;
    $categoryId = 0;
    $errors = $this->validate($name, $qtyRaw, $categoryIdRaw, $qty, $categoryId);
    if ($errors) {
      response_json(['ok' => false, 'errors' => $errors], 400);
      return;
    }

    $item = Item::create(['name' => trim($name), 'qty' => $qty, 'category_id' => $categoryId]);
    $item->load('category');
    response_json(['ok' => true, 'item' => $this->itemToApi($item)], 201);
  }
}
