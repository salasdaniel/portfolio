<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ProgrammingLanguage;
use App\Models\Database;
use App\Models\Framework;

class ExperienceController extends Controller
{
    /**
     * Display the user's experience page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user()->load([
            'education', 
            'experience', 
            'skills',
            'certifications' => function($query) {
                $query->orderBy('pin_order', 'asc');
            },
            'programmingLanguageSkills',
            'databaseSkills',
            'frameworkSkills',
            'otherTechnologies'
        ]);
        
        return Inertia::render('Experiences/Index', [
            'user' => $user,
            'programmingLanguages' => ProgrammingLanguage::orderBy('name')->get(),
            'databases' => Database::orderBy('name')->get(),
            'frameworks' => Framework::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the user's experience data.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        // Handle CV upload
        if ($request->hasFile('cv_file')) {
            // Delete old CV if exists
            if ($user->cv_file) {
                Storage::disk('public')->delete($user->cv_file);
            }
            
            $path = $request->file('cv_file')->store('cv-files', 'public');
            $user->cv_file = $path;
            $user->save();
        }

        // Handle education and experience from JSON strings
        if ($request->has('education')) {
            $educationData = json_decode($request->input('education'), true);
            if ($educationData) {
                $this->updateEducation($user, $educationData);
            }
        }
        
        if ($request->has('experience')) {
            $experienceData = json_decode($request->input('experience'), true);
            if ($experienceData) {
                $this->updateExperience($user, $experienceData);
            }
        }

        if ($request->has('skills')) {
            $skillsData = json_decode($request->input('skills'), true);
            if ($skillsData) {
                $this->updateSkills($user, $skillsData);
            }
        }

        return redirect()->route('experiences.index')->with('message', 'Experience data updated successfully!');
    }

    /**
     * Store or update a single education record.
     */
    public function storeEducation(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'id' => ['nullable', 'integer'],
            'institution' => ['required', 'string', 'max:255'],
            'degree' => ['required', 'string', 'max:255'],
            'field_of_study' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'is_current' => ['nullable'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        // Handle boolean value properly
        $validated['is_current'] = filter_var($validated['is_current'] ?? false, FILTER_VALIDATE_BOOLEAN);
        
        // Clean end_date if is_current is true
        if ($validated['is_current']) {
            $validated['end_date'] = null;
        }

        if (isset($validated['id']) && $validated['id']) {
            // Update existing record
            $education = $user->education()->findOrFail($validated['id']);
            $education->update($validated);
        } else {
            // Create new record
            unset($validated['id']);
            $validated['sort_order'] = $validated['sort_order'] ?? $user->education()->count();
            $education = $user->education()->create($validated);
        }

        return response()->json([
            'message' => 'Education record saved successfully!',
            'education' => $education
        ]);
    }

    /**
     * Store or update a single work experience record.
     */
    public function storeWork(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'id' => ['nullable', 'integer'],
            'position' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'is_current' => ['nullable'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        // Handle boolean value properly
        $validated['is_current'] = filter_var($validated['is_current'] ?? false, FILTER_VALIDATE_BOOLEAN);
        
        // Clean end_date if is_current is true
        if ($validated['is_current']) {
            $validated['end_date'] = null;
        }

        if (isset($validated['id']) && $validated['id']) {
            // Update existing record
            $experience = $user->experience()->findOrFail($validated['id']);
            $experience->update($validated);
        } else {
            // Create new record
            unset($validated['id']);
            $validated['sort_order'] = $validated['sort_order'] ?? $user->experience()->count();
            $experience = $user->experience()->create($validated);
        }

        return response()->json([
            'message' => 'Work experience record saved successfully!',
            'experience' => $experience
        ]);
    }

    /**
     * Store or update a single skill record.
     */
    public function storeSkill(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'id' => ['nullable', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        if (isset($validated['id']) && $validated['id']) {
            // Update existing record
            $skill = $user->skills()->findOrFail($validated['id']);
            $skill->update($validated);
        } else {
            // Create new record
            unset($validated['id']);
            $validated['sort_order'] = $validated['sort_order'] ?? $user->skills()->count();
            $skill = $user->skills()->create($validated);
        }

        return response()->json([
            'message' => 'Skill record saved successfully!',
            'skill' => $skill
        ]);
    }
    
    private function updateEducation($user, $educationData)
    {
        // Delete existing education records for this user
        $user->education()->delete();
        
        // Create new education records
        foreach ($educationData as $index => $education) {
            $user->education()->create([
                'institution' => $education['institution'],
                'degree' => $education['degree'],
                'field_of_study' => $education['field_of_study'] ?? null,
                'start_date' => $education['start_date'],
                'end_date' => $education['end_date'] ?? null,
                'is_current' => filter_var($education['is_current'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'description' => $education['description'] ?? null,
                'sort_order' => $index,
            ]);
        }
    }
    
    private function updateExperience($user, $experienceData)
    {
        // Delete existing experience records for this user
        $user->experience()->delete();
        
        // Create new experience records
        foreach ($experienceData as $index => $experience) {
            $user->experience()->create([
                'position' => $experience['position'],
                'company' => $experience['company'],
                'location' => $experience['location'] ?? null,
                'start_date' => $experience['start_date'],
                'end_date' => $experience['end_date'] ?? null,
                'is_current' => filter_var($experience['is_current'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'description' => $experience['description'] ?? null,
                'sort_order' => $index,
            ]);
        }
    }

    private function updateSkills($user, $skillsData)
    {
        // Delete existing skills records for this user
        $user->skills()->delete();
        
        // Create new skills records
        foreach ($skillsData as $index => $skill) {
            $user->skills()->create([
                'title' => $skill['title'],
                'description' => $skill['description'] ?? null,
                'icon' => $skill['icon'] ?? null,
                'sort_order' => $index,
            ]);
        }
    }

    public function destroyEducation(Request $request, $id)
    {
        try {
            $education = $request->user()->education()->findOrFail($id);
            $education->delete();
            
            return response()->json(['message' => 'Education record deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting education record'], 500);
        }
    }

    public function destroyExperience(Request $request, $id)
    {
        try {
            $experience = $request->user()->experience()->findOrFail($id);
            $experience->delete();
            
            return response()->json(['message' => 'Experience record deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting experience record'], 500);
        }
    }

    public function destroySkill(Request $request, $id)
    {
        try {
            $skill = $request->user()->skills()->findOrFail($id);
            $skill->delete();
            
            return response()->json(['message' => 'Skill record deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting skill record'], 500);
        }
    }

    /**
     * Store or update user technologies.
     */
    public function storeTechnologies(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Parse JSON strings from FormData
        $programmingLanguages = $request->has('programming_languages') ? json_decode($request->input('programming_languages'), true) : [];
        $databases = $request->has('databases') ? json_decode($request->input('databases'), true) : [];
        $frameworks = $request->has('frameworks') ? json_decode($request->input('frameworks'), true) : [];
        $otherTechnologies = $request->has('other_technologies') ? json_decode($request->input('other_technologies'), true) : [];
        
        // Log the parsed data for debugging
        Log::info('Parsed technologies data:', [
            'programming_languages' => $programmingLanguages,
            'databases' => $databases,
            'frameworks' => $frameworks,
            'other_technologies' => $otherTechnologies
        ]);
        
        // Merge parsed data back into the request for validation
        $request->merge([
            'programming_languages' => $programmingLanguages,
            'databases' => $databases,
            'frameworks' => $frameworks,
            'other_technologies' => $otherTechnologies
        ]);
        
        // Now validate the merged data
        $validated = $request->validate([
            'programming_languages' => ['nullable', 'array'],
            'programming_languages.*' => ['integer', 'exists:programming_languages,id'],
            'databases' => ['nullable', 'array'],
            'databases.*' => ['integer', 'exists:databases,id'],
            'frameworks' => ['nullable', 'array'],
            'frameworks.*' => ['integer', 'exists:frameworks,id'],
            'other_technologies' => ['nullable', 'array'],
            'other_technologies.*' => ['string', 'max:100'],
        ]);

        Log::info('Validated data:', $validated);

        try {
            // Sync programming languages
            if (isset($validated['programming_languages'])) {
                $user->programmingLanguageSkills()->sync($validated['programming_languages']);
            }

            // Sync databases
            if (isset($validated['databases'])) {
                $user->databaseSkills()->sync($validated['databases']);
            }

            // Sync frameworks
            if (isset($validated['frameworks'])) {
                $user->frameworkSkills()->sync($validated['frameworks']);
            }

            // Handle other technologies
            if (isset($validated['other_technologies'])) {
                // Delete existing other technologies
                $user->otherTechnologies()->delete();
                
                // Create new ones
                foreach ($validated['other_technologies'] as $index => $technology) {
                    $user->otherTechnologies()->create([
                        'name' => $technology,
                        'sort_order' => $index,
                    ]);
                }
            }

            $userWithTech = $user->load(['programmingLanguageSkills', 'databaseSkills', 'frameworkSkills', 'otherTechnologies']);
            
            return response()->json([
                'success' => true,
                'message' => 'Technologies saved successfully!',
                'programming_languages' => $userWithTech->programmingLanguageSkills,
                'databases' => $userWithTech->databaseSkills,
                'frameworks' => $userWithTech->frameworkSkills,
                'other_technologies' => $userWithTech->otherTechnologies
            ]);
        } catch (\Exception $e) {
            Log::error('Error saving technologies: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['success' => false, 'message' => 'Error saving technologies: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store or update user professional information.
     */
    public function storeProfessionalInfo(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'profession' => ['nullable', 'string', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
        ]);

        try {
            $user->update($validated);

            return response()->json([
                'message' => 'Professional information saved successfully!',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error saving professional information: ' . $e->getMessage()], 500);
        }
    }
}
