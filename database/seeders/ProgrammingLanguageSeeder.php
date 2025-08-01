<?php

namespace Database\Seeders;

use App\Models\ProgrammingLanguage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgrammingLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $languages = [
            ['name' => 'JavaScript', 'color' => '#F7DF1E'],
            ['name' => 'TypeScript', 'color' => '#3178C6'],
            ['name' => 'PHP', 'color' => '#777BB4'],
            ['name' => 'Python', 'color' => '#3776AB'],
            ['name' => 'Java', 'color' => '#ED8B00'],
            ['name' => 'C#', 'color' => '#239120'],
            ['name' => 'C++', 'color' => '#00599C'],
            ['name' => 'C', 'color' => '#A8B9CC'],
            ['name' => 'Go', 'color' => '#00ADD8'],
            ['name' => 'Rust', 'color' => '#000000'],
            ['name' => 'Swift', 'color' => '#FA7343'],
            ['name' => 'Kotlin', 'color' => '#7F52FF'],
            ['name' => 'Ruby', 'color' => '#CC342D'],
            ['name' => 'Dart', 'color' => '#0175C2'],
            ['name' => 'HTML', 'color' => '#E34F26'],
            ['name' => 'CSS', 'color' => '#1572B6'],
            ['name' => 'SQL', 'color' => '#4479A1'],
            ['name' => 'R', 'color' => '#276DC3'],
            ['name' => 'MATLAB', 'color' => '#E16737'],
            ['name' => 'Scala', 'color' => '#DC322F'],
        ];

        foreach ($languages as $language) {
            ProgrammingLanguage::create($language);
        }
    }
}
