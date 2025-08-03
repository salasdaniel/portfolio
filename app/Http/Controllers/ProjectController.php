<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProgrammingLanguage;
use App\Models\Framework;
use App\Models\Environment;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $projects = Project::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Projects/Create', [
            'programmingLanguages' => ProgrammingLanguage::where('is_active', true)->orderBy('name')->get(),
            'frameworks' => Framework::where('is_active', true)->orderBy('name')->get(),
            'environments' => Environment::where('is_active', true)->orderBy('name')->get(),
            'statuses' => \App\Models\Status::where('is_active', true)->orderBy('sort_order')->get(),
            'databases' => \App\Models\Database::where('is_active', true)->orderBy('sort_order')->get(),
            'projectTypes' => \App\Models\ProjectType::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'programming_language_ids' => 'nullable|array',
                'programming_language_ids.*' => 'exists:programming_languages,id',
                'framework_ids' => 'nullable|array',
                'framework_ids.*' => 'exists:frameworks,id',
                'project_type_id' => 'nullable|exists:project_types,id',
                'environment_id' => 'nullable|exists:environments,id',
                'status_id' => 'nullable|exists:statuses,id',
                'database_id' => 'nullable|exists:databases,id',
                'tags' => 'nullable|array',
                'tags.*' => 'string|max:50',
                'repo_url' => 'nullable|url|max:255',
                'live_url' => 'nullable|max:255', // Allow empty or any string, not just URLs
                'image_url' => 'nullable|string|max:255', // Allow file paths and URLs
                'is_private' => 'nullable|boolean',
                'is_pinned' => 'nullable|boolean',
                'pin_order' => 'nullable|integer|min:1',
            ]);

            // Handle pin order auto-assignment
            $pinOrder = null;
            if (!empty($validated['is_pinned'])) {
                if (!empty($validated['pin_order'])) {
                    $pinOrder = $validated['pin_order'];
                } else {
                    // Auto-assign next available pin order
                    $maxOrder = Project::where('user_id', $request->user()->id)
                                    ->where('is_pinned', true)
                                    ->max('pin_order') ?? 0;
                    $pinOrder = $maxOrder + 1;
                }
            }

            $project = Project::create([
                'user_id' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'project_type_id' => $validated['project_type_id'] ?? null,
                'environment_id' => $validated['environment_id'] ?? null,
                'status_id' => $validated['status_id'] ?? null,
                'database_id' => $validated['database_id'] ?? null,
                'repo_url' => $validated['repo_url'] ?? null,
                'live_url' => $validated['live_url'] ?? null,
                'image_url' => $validated['image_url'] ?? null,
                'is_private' => $validated['is_private'] ?? false,
                'is_pinned' => $validated['is_pinned'] ?? false,
                'pin_order' => $pinOrder,
            ]);

            // Sync relationships
            if (!empty($validated['programming_language_ids'])) {
                $project->programmingLanguages()->sync($validated['programming_language_ids']);
            }

            if (!empty($validated['framework_ids'])) {
                $project->frameworks()->sync($validated['framework_ids']);
            }

            if (!empty($validated['tags'])) {
                $project->syncTags($validated['tags']);
            }

            return redirect()->route('projects.index')
                ->with('success', 'Project created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create project. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Project $project)
    {
        // Check if the project belongs to the authenticated user
        if ($project->user_id !== $request->user()->id) {
            abort(404);
        }

        return Inertia::render('Projects/Show', [
            'project' => $project
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Project $project)
    {
        // Check if the project belongs to the authenticated user
        if ($project->user_id !== $request->user()->id) {
            abort(404);
        }

        return Inertia::render('Projects/Edit', [
            'project' => $project->load(['programmingLanguages', 'frameworks', 'tags', 'environment', 'status', 'database', 'projectType']),
            'programmingLanguages' => ProgrammingLanguage::where('is_active', true)->orderBy('name')->get(),
            'frameworks' => Framework::where('is_active', true)->orderBy('name')->get(),
            'environments' => Environment::where('is_active', true)->orderBy('name')->get(),
            'statuses' => \App\Models\Status::where('is_active', true)->orderBy('sort_order')->get(),
            'databases' => \App\Models\Database::where('is_active', true)->orderBy('sort_order')->get(),
            'projectTypes' => \App\Models\ProjectType::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        try {
            // Check if the project belongs to the authenticated user
            if ($project->user_id !== $request->user()->id) {
                abort(404);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'programming_language_ids' => 'nullable|array',
                'programming_language_ids.*' => 'exists:programming_languages,id',
                'framework_ids' => 'nullable|array',
                'framework_ids.*' => 'exists:frameworks,id',
                'project_type_id' => 'nullable|exists:project_types,id',
                'environment_id' => 'nullable|exists:environments,id',
                'status_id' => 'nullable|exists:statuses,id',
                'database_id' => 'nullable|exists:databases,id',
                'tags' => 'nullable|array',
                'tags.*' => 'string|max:50',
                'repo_url' => 'nullable|url|max:255',
                'live_url' => 'nullable|max:255', // Allow empty or any string, not just URLs
                'image_url' => 'nullable|string|max:255', // Allow file paths and URLs
                'is_private' => 'nullable|boolean',
                'is_pinned' => 'nullable|boolean',
                'pin_order' => 'nullable|integer|min:1',
            ]);

            // Handle pin order logic
            $pinOrder = $project->pin_order;
            $wasPinned = $project->is_pinned;
            $willBePinned = $validated['is_pinned'] ?? false;

            if ($willBePinned && !$wasPinned) {
                // Project is being pinned for the first time
                if (!empty($validated['pin_order'])) {
                    $pinOrder = $validated['pin_order'];
                } else {
                    // Auto-assign next available pin order
                    $maxOrder = Project::where('user_id', $request->user()->id)
                                    ->where('is_pinned', true)
                                    ->where('id', '!=', $project->id)
                                    ->max('pin_order') ?? 0;
                    $pinOrder = $maxOrder + 1;
                }
            } elseif ($willBePinned && $wasPinned) {
                // Project is already pinned, maybe updating order
                if (!empty($validated['pin_order'])) {
                    $pinOrder = $validated['pin_order'];
                }
            } elseif (!$willBePinned && $wasPinned) {
                // Project is being unpinned
                $pinOrder = null;
            }

            $project->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'project_type_id' => $validated['project_type_id'] ?? null,
                'environment_id' => $validated['environment_id'] ?? null,
                'status_id' => $validated['status_id'] ?? null,
                'database_id' => $validated['database_id'] ?? null,
                'repo_url' => $validated['repo_url'] ?? null,
                'live_url' => $validated['live_url'] ?? null,
                'image_url' => $validated['image_url'] ?? null,
                'is_private' => $validated['is_private'] ?? false,
                'is_pinned' => $willBePinned,
                'pin_order' => $pinOrder,
            ]);

            // Sync relationships
            $project->programmingLanguages()->sync($validated['programming_language_ids'] ?? []);
            $project->frameworks()->sync($validated['framework_ids'] ?? []);

            if (!empty($validated['tags'])) {
                $project->syncTags($validated['tags']);
            } else {
                $project->tags()->sync([]);
            }

            return redirect()->route('projects.index')
                ->with('success', 'Project updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update project. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Project $project)
    {
        try {
            // Check if the project belongs to the authenticated user
            if ($project->user_id !== $request->user()->id) {
                abort(404);
            }

            $project->delete();

            return redirect()->route('projects.index')
                ->with('success', 'Project deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete project. Please try again.');
        }
    }
}
