<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::create([
            'title' => 'E-commerce Platform',
            'description' => 'A full-featured e-commerce platform with user authentication, product management, shopping cart, and payment integration.',
            'programming_languages' => 'PHP, JavaScript, HTML, CSS',
            'frameworks' => 'Laravel, React, Tailwind CSS',
            'tags' => 'E-commerce, Web, Full-stack',
            'environment' => 'AWS, Docker',
            'repo_url' => 'https://github.com/username/ecommerce-platform',
            'live_url' => 'https://ecommerce-demo.example.com',
            'image_url' => 'https://via.placeholder.com/800x400?text=E-commerce+Platform',
        ]);

        Project::create([
            'title' => 'Task Management API',
            'description' => 'RESTful API for task management with user authentication, team collaboration, and real-time notifications.',
            'programming_languages' => 'PHP, SQL',
            'frameworks' => 'Laravel, Sanctum',
            'tags' => 'API, Backend, Productivity',
            'environment' => 'Vercel, PostgreSQL',
            'repo_url' => 'https://github.com/username/task-api',
            'live_url' => 'https://task-api.example.com',
            'image_url' => 'https://via.placeholder.com/800x400?text=Task+Management+API',
        ]);

        Project::create([
            'title' => 'Portfolio Website',
            'description' => 'Personal portfolio website built with modern web technologies, featuring project showcase and blog.',
            'programming_languages' => 'TypeScript, JavaScript, HTML, CSS',
            'frameworks' => 'Next.js, React, Tailwind CSS',
            'tags' => 'Portfolio, Web, Frontend',
            'environment' => 'Vercel',
            'repo_url' => 'https://github.com/username/portfolio',
            'live_url' => 'https://portfolio.example.com',
            'image_url' => 'https://via.placeholder.com/800x400?text=Portfolio+Website',
        ]);
    }
}
