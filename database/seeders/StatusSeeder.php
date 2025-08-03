<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Status;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Planning',
                'color' => 'blue',
                'sort_order' => 1,
            ],
            [
                'name' => 'In Progress',
                'color' => 'yellow',
                'sort_order' => 2,
            ],
            [
                'name' => 'Review',
                'color' => 'orange',
                'sort_order' => 3,
            ],
            [
                'name' => 'Testing',
                'color' => 'purple',
                'sort_order' => 4,
            ],
            [
                'name' => 'Completed',
                'color' => 'green',
                'sort_order' => 5,
            ],
            [
                'name' => 'On Hold',
                'color' => 'gray',
                'sort_order' => 6,
            ],
            [
                'name' => 'Cancelled',
                'color' => 'red',
                'sort_order' => 7,
            ],
        ];

        foreach ($statuses as $status) {
            Status::firstOrCreate(
                ['name' => $status['name']],
                $status
            );
        }
    }
}
