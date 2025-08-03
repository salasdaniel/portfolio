<?php

namespace Database\Seeders;

use App\Models\ProjectType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projectTypes = [
            [
                'name' => 'Frontend',
                'description' => 'Client-side development focusing on user interfaces',
                'color' => '#3B82F6', // Blue
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Backend',
                'description' => 'Server-side development focusing on APIs and business logic',
                'color' => '#10B981', // Green
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Full-Stack',
                'description' => 'End-to-end development covering both frontend and backend',
                'color' => '#8B5CF6', // Purple
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Mobile App',
                'description' => 'Native or cross-platform mobile application development',
                'color' => '#F59E0B', // Amber
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Desktop App',
                'description' => 'Desktop application development',
                'color' => '#EF4444', // Red
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'API',
                'description' => 'Application Programming Interface development',
                'color' => '#06B6D4', // Cyan
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'DevOps',
                'description' => 'Development operations, CI/CD, and infrastructure',
                'color' => '#84CC16', // Lime
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Data Science',
                'description' => 'Data analysis, visualization, and scientific computing',
                'color' => '#EC4899', // Pink
                'sort_order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Machine Learning',
                'description' => 'AI and machine learning model development',
                'color' => '#6366F1', // Indigo
                'sort_order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'CLI Tool',
                'description' => 'Command-line interface applications and utilities',
                'color' => '#6B7280', // Gray
                'sort_order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Library/Package',
                'description' => 'Reusable code libraries and packages',
                'color' => '#7C3AED', // Violet
                'sort_order' => 11,
                'is_active' => true,
            ],
            [
                'name' => 'Microservice',
                'description' => 'Individual service in a microservices architecture',
                'color' => '#059669', // Emerald
                'sort_order' => 12,
                'is_active' => true,
            ]
        ];

        foreach ($projectTypes as $projectType) {
            ProjectType::create($projectType);
        }
    }
}
