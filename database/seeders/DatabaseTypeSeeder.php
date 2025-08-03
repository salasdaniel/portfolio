<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Database;

class DatabaseTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $databases = [
            // SQL Databases
            [
                'name' => 'MySQL',
                'type' => 'SQL',
                'icon' => 'mysql',
                'sort_order' => 1,
            ],
            [
                'name' => 'PostgreSQL',
                'type' => 'SQL',
                'icon' => 'postgresql',
                'sort_order' => 2,
            ],
            [
                'name' => 'SQLite',
                'type' => 'SQL',
                'icon' => 'sqlite',
                'sort_order' => 3,
            ],
            [
                'name' => 'SQL Server',
                'type' => 'SQL',
                'icon' => 'sqlserver',
                'sort_order' => 4,
            ],
            [
                'name' => 'Oracle',
                'type' => 'SQL',
                'icon' => 'oracle',
                'sort_order' => 5,
            ],
            [
                'name' => 'MariaDB',
                'type' => 'SQL',
                'icon' => 'mariadb',
                'sort_order' => 6,
            ],
            
            // NoSQL Databases
            [
                'name' => 'MongoDB',
                'type' => 'NoSQL',
                'icon' => 'mongodb',
                'sort_order' => 7,
            ],
            [
                'name' => 'Redis',
                'type' => 'NoSQL',
                'icon' => 'redis',
                'sort_order' => 8,
            ],
            [
                'name' => 'Cassandra',
                'type' => 'NoSQL',
                'icon' => 'cassandra',
                'sort_order' => 9,
            ],
            [
                'name' => 'CouchDB',
                'type' => 'NoSQL',
                'icon' => 'couchdb',
                'sort_order' => 10,
            ],
            [
                'name' => 'Firebase',
                'type' => 'NoSQL',
                'icon' => 'firebase',
                'sort_order' => 11,
            ],
            [
                'name' => 'Elasticsearch',
                'type' => 'NoSQL',
                'icon' => 'elasticsearch',
                'sort_order' => 12,
            ],
            
            // Other
            [
                'name' => 'None',
                'type' => 'Other',
                'icon' => 'none',
                'sort_order' => 99,
            ],
        ];

        foreach ($databases as $database) {
            Database::firstOrCreate(
                ['name' => $database['name']],
                $database
            );
        }
    }
}
