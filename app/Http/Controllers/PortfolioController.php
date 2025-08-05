<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class PortfolioController extends Controller
{
    /**
     * Display the welcome page with user search
     */
    public function welcome(): Response
    {
        return Inertia::render('Welcome');
    }

    /**
     * Search users by username for the combobox
     */
    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->input('q', '');
        
        $users = User::where('username', 'like', "%{$query}%")
            ->select('id', 'name', 'profession', 'username')
            ->limit(10)
            ->get();

        return response()->json($users);
    }

    /**
     * Display a user's public portfolio
     */
    public function show(string $username): Response
    {
        // Decode the URL-encoded username
        $decodedUsername = urldecode($username);
        
        $user = User::where('username', $decodedUsername)
            ->with([
                'education' => function ($query) {
                    $query->orderBy('start_date', 'desc');
                },
                'experience' => function ($query) {
                    $query->orderBy('start_date', 'desc');
                },
                'skills' => function ($query) {
                    $query->orderBy('sort_order');
                },
                'projects' => function ($query) {
                    $query->with([
                        'programmingLanguages',
                        'frameworks', 
                        'tags',
                        'environment',
                        'status',
                        'database',
                        'projectType'
                    ])->orderBy('created_at', 'desc');
                },
                'programmingLanguageSkills',
                'databaseSkills',
                'frameworkSkills',
                'otherTechnologies' => function ($query) {
                    $query->orderBy('sort_order');
                }
            ])
            ->firstOrFail();

        // Transform projects to match the required structure
        $transformedProjects = $user->projects->map(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'description' => $project->description,
                'repo_url' => $project->repo_url,
                'live_url' => $project->live_url,
                'image_url' => $project->image_url,
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
                'environment_id' => $project->environment_id,
                'user_id' => $project->user_id,
                'status_id' => $project->status_id,
                'database_id' => $project->database_id,
                'project_type_id' => $project->project_type_id,
                'is_private' => $project->is_private,
                'is_pinned' => $project->is_pinned,
                'pin_order' => $project->pin_order,
                'programming_languages' => $project->programmingLanguages ? $project->programmingLanguages->pluck('name')->toArray() : [],
                'frameworks' => $project->frameworks ? $project->frameworks->pluck('name')->toArray() : [],
                'tags' => $project->tags ? $project->tags->pluck('name')->toArray() : [],
                'environment' => $project->environment ? $project->environment->name : null,
                'status' => $project->status ? $project->status->name : null,
                'database' => $project->database ? $project->database->name : null,
                'project_type' => $project->projectType ? $project->projectType->name : null,
            ];
        });

        return Inertia::render('Portfolio/Show', [
            'user' => $user,
            'projects' => $transformedProjects,
            'username' => $decodedUsername
        ]);
    }
}
