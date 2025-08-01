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
    public function index()
    {
        $projects = Project::latest()->paginate(10);
        
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
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'programming_language_ids' => 'nullable|array',
            'programming_language_ids.*' => 'exists:programming_languages,id',
            'framework_ids' => 'nullable|array',
            'framework_ids.*' => 'exists:frameworks,id',
            'environment_id' => 'nullable|exists:environments,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'repo_url' => 'nullable|url|max:255',
            'live_url' => 'nullable|url|max:255',
            'image_url' => 'nullable|url|max:255',
        ]);

        $project = Project::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'environment_id' => $validated['environment_id'] ?? null,
            'repo_url' => $validated['repo_url'] ?? null,
            'live_url' => $validated['live_url'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
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
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return Inertia::render('Projects/Show', [
            'project' => $project
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project->load(['programmingLanguages', 'frameworks', 'tags', 'environment']),
            'programmingLanguages' => ProgrammingLanguage::where('is_active', true)->orderBy('name')->get(),
            'frameworks' => Framework::where('is_active', true)->orderBy('name')->get(),
            'environments' => Environment::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'programming_language_ids' => 'nullable|array',
            'programming_language_ids.*' => 'exists:programming_languages,id',
            'framework_ids' => 'nullable|array',
            'framework_ids.*' => 'exists:frameworks,id',
            'environment_id' => 'nullable|exists:environments,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'repo_url' => 'nullable|url|max:255',
            'live_url' => 'nullable|url|max:255',
            'image_url' => 'nullable|url|max:255',
        ]);

        $project->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'environment_id' => $validated['environment_id'] ?? null,
            'repo_url' => $validated['repo_url'] ?? null,
            'live_url' => $validated['live_url'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
