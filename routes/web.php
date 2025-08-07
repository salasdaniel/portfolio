<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Include auth routes first (login, register, etc.)
require __DIR__.'/auth.php';

// Public routes - accessible without authentication
Route::get('/', [PortfolioController::class, 'welcome'])->name('home');
Route::get('/search-users', [PortfolioController::class, 'searchUsers'])->name('search.users');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Projects CRUD routes
    Route::resource('projects', ProjectController::class);
    
    // Experience routes
    Route::get('experiences', [ExperienceController::class, 'index'])->name('experiences.index');
    Route::post('experiences', [ExperienceController::class, 'store'])->name('experiences.store');
    Route::post('experiences/education', [ExperienceController::class, 'storeEducation'])->name('experiences.education.store');
    Route::post('experiences/work', [ExperienceController::class, 'storeWork'])->name('experiences.work.store');
    Route::post('experiences/skill', [ExperienceController::class, 'storeSkill'])->name('experiences.skill.store');
    Route::post('experiences/technologies', [ExperienceController::class, 'storeTechnologies'])->name('experiences.technologies.store');
    Route::post('experiences/professional-info', [ExperienceController::class, 'storeProfessionalInfo'])->name('experiences.professional-info.store');
    Route::delete('experiences/education/{id}', [ExperienceController::class, 'destroyEducation'])->name('education.destroy');
    Route::delete('experiences/work/{id}', [ExperienceController::class, 'destroyExperience'])->name('experience.destroy');
    Route::delete('experiences/skill/{id}', [ExperienceController::class, 'destroySkill'])->name('skill.destroy');
    Route::post('experiences/certification', [CertificationController::class, 'store'])->name('certification.store');
    Route::delete('certification/{id}', [CertificationController::class, 'destroy'])->name('certification.destroy');
});

require __DIR__.'/settings.php';

// Catch-all route for public portfolios - MUST be last
Route::get('/{username}', [PortfolioController::class, 'show'])->name('portfolio.show');
