<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Status>
 */
class StatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['Planning', 'In Progress', 'Review', 'Testing', 'Completed', 'On Hold', 'Cancelled']),
            'color' => $this->faker->randomElement(['blue', 'yellow', 'orange', 'purple', 'green', 'gray', 'red']),
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
