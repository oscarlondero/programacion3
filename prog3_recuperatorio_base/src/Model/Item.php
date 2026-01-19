<?php
declare(strict_types=1);

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Item extends Model {
  protected $table = 'items';
  protected $fillable = ['name','qty'];
}
