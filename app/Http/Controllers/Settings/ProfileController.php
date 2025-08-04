<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Framework;
use App\Models\ProgrammingLanguage;
use App\Models\Database;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('settings/profile-new', [
            'user' => $user->load([
                'programmingLanguageSkills',
                'frameworkSkills',
                'databaseSkills', 
                'otherTechnologies',
                'education',
                'experience'
            ])->makeVisible(['email_verified_at']),
            'programmingLanguages' => ProgrammingLanguage::where('is_active', true)
                ->orderBy('name')
                ->get(),
            'frameworks' => Framework::where('is_active', true)
                ->orderBy('name')
                ->get(),
            'databases' => \App\Models\Database::where('is_active', true)
                ->orderBy('name')
                ->get(),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        
        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            
            $path = $request->file('profile_image')->store('profile-images', 'public');
            $validated['profile_image'] = $path;
        }
        
        // Update basic profile fields
        $profileFields = collect($validated)->only([
            'name', 'username', 'email', 'phone', 'location', 
            'linkedin_url', 'github_url', 'born_date', 'profession', 
            'description', 'theme_color', 'profile_image'
        ])->toArray();
        
        $user->fill($profileFields);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
        
        // Update skills relationships
        if (isset($validated['programming_language_ids'])) {
            $this->updateProgrammingLanguageSkills($user, $validated['programming_language_ids']);
        }
        
        if (isset($validated['framework_ids'])) {
            $this->updateFrameworkSkills($user, $validated['framework_ids']);
        }
        
        if (isset($validated['database_ids'])) {
            $this->updateDatabaseSkills($user, $validated['database_ids']);
        }
        
        if (isset($validated['other_technologies'])) {
            $this->updateOtherTechnologies($user, $validated['other_technologies']);
        }

        return to_route('profile.edit')->with('status', 'Profile updated successfully!');
    }
    
    private function updateProgrammingLanguageSkills($user, $languageIds)
    {
        $syncData = [];
        foreach ($languageIds as $id) {
            $syncData[$id] = ['experience_level' => 'beginner'];
        }
        $user->programmingLanguageSkills()->sync($syncData);
    }
    
    private function updateFrameworkSkills($user, $frameworkIds)
    {
        $syncData = [];
        foreach ($frameworkIds as $id) {
            $syncData[$id] = ['experience_level' => 'beginner'];
        }
        $user->frameworkSkills()->sync($syncData);
    }
    
    private function updateDatabaseSkills($user, $databaseIds)
    {
        $syncData = [];
        foreach ($databaseIds as $id) {
            $syncData[$id] = ['experience_level' => 'beginner'];
        }
        $user->databaseSkills()->sync($syncData);
    }
    
    private function updateOtherTechnologies($user, $technologies)
    {
        // Delete existing other technologies for this user
        $user->otherTechnologies()->delete();
        
        // Create new ones from the array of technology names
        foreach ($technologies as $techName) {
            $user->otherTechnologies()->create([
                'name' => $techName,
                'experience_level' => 'beginner',
                'category' => null,
            ]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
