<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'nullable',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'born_date' => ['nullable', 'date', 'before:today'],
            'profession' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'theme_color' => ['required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'profile_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            
            // Skills
            // Skills validation
            'programming_language_ids' => ['nullable', 'array'],
            'programming_language_ids.*' => ['exists:programming_languages,id'],
            
            'framework_ids' => ['nullable', 'array'],
            'framework_ids.*' => ['exists:frameworks,id'],
            
            'database_ids' => ['nullable', 'array'],
                        'database_ids.*' => ['exists:databases,id'],
            
            // Other technologies validation
            'other_technologies' => ['nullable', 'array'],
            'other_technologies.*' => ['string', 'max:255'],
        ];
    }
}
