<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'environment_id',
        'repo_url',
        'live_url',
        'image_url',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $with = [
        'programmingLanguages',
        'frameworks',
        'tags',
        'environment'
    ];

    public function programmingLanguages()
    {
        return $this->belongsToMany(ProgrammingLanguage::class, 'project_programming_language', 'project_id', 'programming_language_id');
    }

    public function frameworks()
    {
        return $this->belongsToMany(Framework::class, 'project_framework', 'project_id', 'framework_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'project_tag', 'project_id', 'tag_id');
    }

    public function environment()
    {
        return $this->belongsTo(Environment::class);
    }

    public function syncTags(array $tagNames)
    {
        $tags = collect($tagNames)->map(function ($name) {
            return Tag::findOrCreate(trim($name));
        });

        $this->tags()->sync($tags->pluck('id'));
        
        // Update usage count
        Tag::whereIn('id', $tags->pluck('id'))->increment('usage_count');
    }
}
