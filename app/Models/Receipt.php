<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    //
    protected $fillable = [
        'user_id',
        'image_path',
        'ai_response',
        'status',
    ];

    protected $casts = [
        'ai_response' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function income()
    {
        return $this->hasMany(Expense::class);
    }

    public function correction()
    {
        return $this->hasMany(Expense::class);
    }
}
