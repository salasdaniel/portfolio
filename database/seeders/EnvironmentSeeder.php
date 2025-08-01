<?php

namespace Database\Seeders;

use App\Models\Environment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnvironmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $environments = [
            [
                'name' => 'Production',
                'description' => 'Live environment accessible to end users',
                'color' => '#22C55E'
            ],
            [
                'name' => 'Staging',
                'description' => 'Pre-production environment for testing',
                'color' => '#F59E0B'
            ],
            [
                'name' => 'Development',
                'description' => 'Development environment for active coding',
                'color' => '#3B82F6'
            ],
            [
                'name' => 'Local',
                'description' => 'Local development environment',
                'color' => '#8B5CF6'
            ],
            [
                'name' => 'Testing',
                'description' => 'Automated testing environment',
                'color' => '#EC4899'
            ],
        ];

        foreach ($environments as $environment) {
            Environment::create($environment);
        }
    }
}
