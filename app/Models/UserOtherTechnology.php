<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserOtherTechnology extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'experience_level',
        'category'
    ];

    protected $casts = [
        'experience_level' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
