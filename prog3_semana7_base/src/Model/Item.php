<?php
declare(strict_types=1);

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Item extends Model {
  protected $table = 'items';
  protected $fillable = ['name', 'qty', 'category_id'];
  // created_at y updated_at se manejan automaticamente si existen columnas.

  public function category() {
    return $this->belongsTo(Category::class, 'category_id');
  }
}
