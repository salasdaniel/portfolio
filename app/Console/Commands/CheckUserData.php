<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class CheckUserData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:user-data {username?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check user data and relationships';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $username = $this->argument('username') ?? 'Daniel Alberto';
        
        $this->info("Checking data for username: {$username}");
        
        $user = User::where('username', $username)->first();
        
        if (!$user) {
            $this->error("User with username '{$username}' not found.");
            $this->info("Available users:");
            User::all(['id', 'name', 'username'])->each(function($user) {
                $this->line("ID: {$user->id}, Name: {$user->name}, Username: {$user->username}");
            });
            return;
        }
        
        $this->info("User found: {$user->name} (ID: {$user->id})");
        
        // Load relationships
        $user->load([
            'skills',
            'programmingLanguageSkills',
            'databaseSkills',
            'frameworkSkills',
            'otherTechnologies'
        ]);
        
        $this->info("Skills count: " . $user->skills->count());
        $this->info("Programming Languages count: " . $user->programmingLanguageSkills->count());
        $this->info("Database Skills count: " . $user->databaseSkills->count());
        $this->info("Framework Skills count: " . $user->frameworkSkills->count());
        $this->info("Other Technologies count: " . $user->otherTechnologies->count());
        
        if ($user->skills->count() > 0) {
            $this->info("Skills:");
            $user->skills->each(function($skill) {
                $this->line("- {$skill->title} ({$skill->description})");
            });
        }
        
        if ($user->programmingLanguageSkills->count() > 0) {
            $this->info("Programming Languages:");
            $user->programmingLanguageSkills->each(function($skill) {
                $this->line("- Programming Language Skill ID: {$skill->id} (Level: {$skill->experience_level})");
            });
        }
        
        if ($user->databaseSkills->count() > 0) {
            $this->info("Databases:");
            $user->databaseSkills->each(function($skill) {
                $this->line("- Database Skill ID: {$skill->id} (Level: {$skill->pivot->experience_level})");
            });
        }
        
        if ($user->frameworkSkills->count() > 0) {
            $this->info("Frameworks:");
            $user->frameworkSkills->each(function($skill) {
                $this->line("- Framework Skill ID: {$skill->id} (Level: {$skill->pivot->experience_level})");
            });
        }
    }
}
