<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'project_type_id',
        'environment_id',
        'status_id',
        'database_id',
        'repo_url',
        'live_url',
        'image_url',
        'is_private',
        'is_pinned',
        'pin_order',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_private' => 'boolean',
        'is_pinned' => 'boolean',
        'pin_order' => 'integer',
    ];

    protected $with = [
        'programmingLanguages',
        'frameworks',
        'tags',
        'environment',
        'status', 
        'database',
        'projectType'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    // Single relationships for Environment, Status, and Database
    public function environment()
    {
        return $this->belongsTo(Environment::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function database()
    {
        return $this->belongsTo(Database::class);
    }

    public function projectType()
    {
        return $this->belongsTo(ProjectType::class);
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

    // Scopes for pinned projects
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeOrderedByPin($query)
    {
        return $query->orderBy('pin_order', 'asc');
    }

    public function scopePinnedAndOrdered($query)
    {
        return $query->pinned()->orderBy('pin_order', 'asc');
    }
}
