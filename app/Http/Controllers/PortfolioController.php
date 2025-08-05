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
                    $query->orderBy('created_at', 'desc');
                },
                'programmingLanguageSkills',
                'databaseSkills',
                'frameworkSkills',
                'otherTechnologies' => function ($query) {
                    $query->orderBy('sort_order');
                }
            ])
            ->firstOrFail();

        return Inertia::render('Portfolio/Show', [
            'user' => $user,
            'username' => $decodedUsername
        ]);
    }
}
