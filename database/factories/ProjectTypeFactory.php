<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjectType>
 */
class ProjectTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement([
                'Frontend',
                'Backend', 
                'Full-Stack',
                'Mobile App',
                'Desktop App',
                'API',
                'DevOps',
                'Data Science',
                'Machine Learning',
                'Game Development',
                'IoT',
                'Blockchain',
                'CLI Tool',
                'Library/Package',
                'Microservice'
            ]),
            'description' => $this->faker->sentence(),
            'color' => $this->faker->hexColor(),
            'sort_order' => $this->faker->numberBetween(0, 100),
            'is_active' => true,
        ];
    }
}
