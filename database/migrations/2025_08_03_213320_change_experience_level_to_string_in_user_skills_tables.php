<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change experience_level from integer to string in user_programming_languages
        Schema::table('user_programming_languages', function (Blueprint $table) {
            $table->string('experience_level')->default('beginner')->change();
        });

        // Change experience_level from integer to string in user_frameworks
        Schema::table('user_frameworks', function (Blueprint $table) {
            $table->string('experience_level')->default('beginner')->change();
        });

        // Change experience_level from integer to string in user_other_technologies
        Schema::table('user_other_technologies', function (Blueprint $table) {
            $table->string('experience_level')->default('beginner')->change();
        });
    }

    public function down(): void
    {
        // Revert back to integer
        Schema::table('user_programming_languages', function (Blueprint $table) {
            $table->integer('experience_level')->default(1)->change();
        });

        Schema::table('user_frameworks', function (Blueprint $table) {
            $table->integer('experience_level')->default(1)->change();
        });

        Schema::table('user_other_technologies', function (Blueprint $table) {
            $table->integer('experience_level')->default(1)->change();
        });
    }
};
