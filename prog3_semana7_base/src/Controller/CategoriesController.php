<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Category;
use App\Model\Item;

class CategoriesController {

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

    // Cargamos items de la categoría (orden desc por id)
    $items = Item::where('category_id', $categoryId)
      ->orderBy('id','desc')
      ->get()
      ->toArray();

    response_json([
      'ok' => true,
      'category' => ['id' => $cat->id, 'name' => $cat->name],
      'items' => $items
    ], 200);
  }
}
