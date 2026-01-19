<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Category;
use App\Model\Item;

class CategoriesController {

  private function itemToApi(Item $it): array {
    return [
      'id' => $it->id,
      'name' => $it->name,
      'qty' => $it->qty,
      'category_id' => $it->category_id,
      'category_name' => $it->category?->name,
      'is_active' => (int)($it->is_active ?? 1),
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

  public function apiIndex(): void {
    $cats = Category::orderBy('name','asc')->get()->toArray();
    response_json(['ok' => true, 'categories' => $cats], 200);
  }

  public function apiItemsByCategory(int $categoryId): void {
    $cat = Category::find($categoryId);
    if (!$cat) {
      response_json(['ok' => false, 'err' => 'Categoría no encontrada'], 404);
      return;
    }

    $all = (string)($_GET['all'] ?? '0');
    $q = Item::with('category')
      ->where('category_id', $categoryId)
      ->orderBy('id','desc');
    if ($all !== '1') {
      $q->where('is_active', 1);
    }
    $items = $q->get();

    response_json([
      'ok' => true,
      'category' => ['id' => $cat->id, 'name' => $cat->name],
      'items' => $this->itemsToApiArray($items)
    ], 200);
  }
}
