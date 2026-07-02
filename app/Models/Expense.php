<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    //
    protected $fillable = [
        'user_id',
        'receipt_id',
        'spent_at',
        'store_name',
        'category_id',
        'memo',
        'amount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }
}
