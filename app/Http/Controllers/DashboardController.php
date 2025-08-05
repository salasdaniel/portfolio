<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with user summary.
     */
    public function index(Request $request): Response
    {
        $user = $request->user()->load([
            'projects' => function ($query) {
                $query->latest()->limit(3);
            },
            'experience' => function ($query) {
                $query->orderBy('start_date', 'desc')->limit(2);
            },
            'programmingLanguageSkills' => function ($query) {
                $query->limit(5);
            },
            'frameworkSkills' => function ($query) {
                $query->limit(3);
            },
            'databaseSkills' => function ($query) {
                $query->limit(3);
            },
            'otherTechnologies' => function ($query) {
                $query->limit(4);
            },
            'education' => function ($query) {
                $query->orderBy('start_date', 'desc')->limit(2);
            }
        ]);

        return Inertia::render('dashboard', [
            'user' => $user->makeVisible(['email']),
            'stats' => [
                'totalProjects' => $user->projects()->count(),
                'totalExperiences' => $user->experience()->count(),
                'totalSkills' => $user->programmingLanguageSkills()->count() + 
                                $user->frameworkSkills()->count() + 
                                $user->databaseSkills()->count() +
                                $user->otherTechnologies()->count(),
                'totalEducation' => $user->education()->count(),
            ]
        ]);
    }
}
