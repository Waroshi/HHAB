<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Correction extends Model
{
    use HasFactory;

    //

    protected $fillable = [
        'user_id',
        'receipt_id',
        'store_name',
        'ai_category_id',
        'user_category_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }

    public function aiCategory()
    {
        return $this->belongsTo(Category::class, 'ai_category_id');
    }

    public function userCategory()
    {
        return $this->belongsTo(Category::class, 'user_category_id');
    }
}
