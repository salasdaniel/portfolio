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
            ->select('id', 'name', 'profession', 'username','theme_color')
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
                'certifications' => function ($query) {
                    $query->orderBy('pin_order', 'asc');
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

        // Transform experience to match the required structure
        $transformedExperience = $user->experience->map(function ($experience) {
            return [
                'id' => $experience->id,
                'position' => $experience->position,
                'company' => $experience->company,
                'description' => $experience->description,
                'start_date' => $experience->start_date,
                'end_date' => $experience->end_date,
                'is_current' => $experience->is_current,
                'location' => $experience->location,
                'employment_type' => $experience->employment_type,
                'created_at' => $experience->created_at,
                'updated_at' => $experience->updated_at,
            ];
        });

        // Transform education to match the required structure
        $transformedEducation = $user->education->map(function ($education) {
            return [
                'id' => $education->id,
                'degree' => $education->degree,
                'institution' => $education->institution,
                'description' => $education->description,
                'start_date' => $education->start_date,
                'end_date' => $education->end_date,
                'is_current' => $education->is_current,
                'field_of_study' => $education->field_of_study,
                'grade' => $education->grade,
                'created_at' => $education->created_at,
                'updated_at' => $education->updated_at,
            ];
        });

        // Transform certifications to match the required structure
        $transformedCertifications = $user->certifications->map(function ($certification) {
            return [
                'id' => $certification->id,
                'institution' => $certification->institution,
                'description' => $certification->description,
                'start_date' => $certification->start_date,
                'end_date' => $certification->end_date,
                'is_current' => $certification->is_current,
                'field_of_study' => $certification->field_of_study,
                'certification_url' => $certification->certification_url,
                'pin_order' => $certification->pin_order,
                'created_at' => $certification->created_at,
                'updated_at' => $certification->updated_at,
            ];
        });

        return Inertia::render('Portfolio/Show', [
            'user' => $user,
            'projects' => $transformedProjects,
            'experience' => $transformedExperience,
            'education' => $transformedEducation,
            'certifications' => $transformedCertifications,
            'username' => $decodedUsername
        ]);
    }
}
