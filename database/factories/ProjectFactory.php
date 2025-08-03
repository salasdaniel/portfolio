<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'environment_id' => \App\Models\Environment::inRandomOrder()->first()?->id,
            'status_id' => \App\Models\Status::inRandomOrder()->first()?->id,
            'database_id' => \App\Models\Database::inRandomOrder()->first()?->id,
            'repo_url' => $this->faker->url(),
            'live_url' => $this->faker->optional(0.7)->url(), // 70% chance of having a live URL
            'image_url' => $this->faker->optional(0.8)->imageUrl(),
        ];
    }
}
