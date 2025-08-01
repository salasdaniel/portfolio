<?php

namespace Database\Seeders;

use App\Models\Framework;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FrameworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $frameworks = [
            // Frontend Frameworks
            ['name' => 'React', 'category' => 'frontend', 'color' => '#61DAFB'],
            ['name' => 'Vue.js', 'category' => 'frontend', 'color' => '#4FC08D'],
            ['name' => 'Angular', 'category' => 'frontend', 'color' => '#DD0031'],
            ['name' => 'Svelte', 'category' => 'frontend', 'color' => '#FF3E00'],
            ['name' => 'Next.js', 'category' => 'frontend', 'color' => '#000000'],
            ['name' => 'Nuxt.js', 'category' => 'frontend', 'color' => '#00DC82'],
            ['name' => 'Gatsby', 'category' => 'frontend', 'color' => '#663399'],
            
            // Backend Frameworks
            ['name' => 'Laravel', 'category' => 'backend', 'color' => '#FF2D20'],
            ['name' => 'Symfony', 'category' => 'backend', 'color' => '#000000'],
            ['name' => 'Django', 'category' => 'backend', 'color' => '#092E20'],
            ['name' => 'Flask', 'category' => 'backend', 'color' => '#000000'],
            ['name' => 'FastAPI', 'category' => 'backend', 'color' => '#009688'],
            ['name' => 'Express.js', 'category' => 'backend', 'color' => '#000000'],
            ['name' => 'NestJS', 'category' => 'backend', 'color' => '#E0234E'],
            ['name' => 'Spring Boot', 'category' => 'backend', 'color' => '#6DB33F'],
            ['name' => 'ASP.NET Core', 'category' => 'backend', 'color' => '#512BD4'],
            ['name' => 'Ruby on Rails', 'category' => 'backend', 'color' => '#CC0000'],
            
            // Mobile Frameworks
            ['name' => 'React Native', 'category' => 'mobile', 'color' => '#61DAFB'],
            ['name' => 'Flutter', 'category' => 'mobile', 'color' => '#02569B'],
            ['name' => 'Ionic', 'category' => 'mobile', 'color' => '#3880FF'],
            
            // CSS Frameworks
            ['name' => 'Tailwind CSS', 'category' => 'css', 'color' => '#06B6D4'],
            ['name' => 'Bootstrap', 'category' => 'css', 'color' => '#7952B3'],
            ['name' => 'Bulma', 'category' => 'css', 'color' => '#00D1B2'],
            ['name' => 'Material-UI', 'category' => 'css', 'color' => '#0081CB'],
            
            // Fullstack
            ['name' => 'Inertia.js', 'category' => 'fullstack', 'color' => '#9553E9'],
            ['name' => 'Livewire', 'category' => 'fullstack', 'color' => '#4E56A6'],
        ];

        foreach ($frameworks as $framework) {
            Framework::create($framework);
        }
    }
}
