<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'usage_count'
    ];

    protected $casts = [
        'usage_count' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_tag', 'tag_id', 'project_id');
    }

    public static function findOrCreate($name)
    {
        $tag = static::where('name', $name)->first();
        
        if (!$tag) {
            $tag = static::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }
        
        return $tag;
    }
}
