<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ExperienceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('panel', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Projects CRUD routes
    Route::resource('projects', ProjectController::class);
    
    // Experience routes
    Route::get('experiences', [ExperienceController::class, 'index'])->name('experiences.index');
    Route::post('experiences', [ExperienceController::class, 'store'])->name('experiences.store');
    Route::post('experiences/education', [ExperienceController::class, 'storeEducation'])->name('experiences.education.store');
    Route::post('experiences/work', [ExperienceController::class, 'storeWork'])->name('experiences.work.store');
    Route::post('experiences/skill', [ExperienceController::class, 'storeSkill'])->name('experiences.skill.store');
    Route::delete('experiences/education/{id}', [ExperienceController::class, 'destroyEducation'])->name('education.destroy');
    Route::delete('experiences/work/{id}', [ExperienceController::class, 'destroyExperience'])->name('experience.destroy');
    Route::delete('experiences/skill/{id}', [ExperienceController::class, 'destroySkill'])->name('skill.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
