<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'phone',
        'location',
        'linkedin_url',
        'github_url',
        'born_date',
        'profession',
        'description',
        'profile_image',
        'cv_file',
        'theme_color',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'born_date' => 'date',
            'password' => 'hashed',
        ];
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    // Skills relationships
    public function programmingLanguageSkills()
    {
        return $this->belongsToMany(ProgrammingLanguage::class, 'user_programming_languages')
            ->withPivot(['experience_level'])
            ->withTimestamps();
    }

    public function frameworkSkills()
    {
        return $this->belongsToMany(Framework::class, 'user_frameworks')
            ->withPivot(['experience_level'])
            ->withTimestamps();
    }

    public function databaseSkills()
    {
        return $this->belongsToMany(Database::class, 'user_databases')
            ->withPivot(['experience_level'])
            ->withTimestamps();
    }

    public function otherTechnologies()
    {
        return $this->hasMany(UserOtherTechnology::class);
    }

    public function education()
    {
        return $this->hasMany(UserEducation::class)->orderBy('sort_order')->orderBy('start_date', 'desc');
    }

    public function experience()
    {
        return $this->hasMany(UserExperience::class)->orderBy('sort_order')->orderBy('start_date', 'desc');
    }

    public function skills()
    {
        return $this->hasMany(UserSkill::class)->orderBy('sort_order');
    }
}
