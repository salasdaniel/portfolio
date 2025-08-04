<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For PostgreSQL, we need to use raw SQL for type conversion
        if (config('database.default') === 'pgsql') {
            DB::statement('ALTER TABLE user_experience ALTER COLUMN start_date TYPE date USING start_date::date');
            DB::statement('ALTER TABLE user_experience ALTER COLUMN end_date TYPE date USING end_date::date');
        } else {
            Schema::table('user_experience', function (Blueprint $table) {
                $table->date('start_date')->change();
                $table->date('end_date')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_experience', function (Blueprint $table) {
            // Change back to string fields
            $table->string('start_date')->change();
            $table->string('end_date')->nullable()->change();
        });
    }
};
