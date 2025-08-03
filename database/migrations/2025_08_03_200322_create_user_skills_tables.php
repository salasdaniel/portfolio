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
        // User Programming Languages Skills (with description)
        Schema::create('user_programming_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('programming_language_id')->constrained()->onDelete('cascade');
            $table->text('description')->nullable(); // Description of experience with this language
            $table->integer('experience_level')->default(1); // 1-5 scale
            $table->timestamps();
            
            $table->unique(['user_id', 'programming_language_id']);
        });

        // User Frameworks Skills (with description)
        Schema::create('user_frameworks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('framework_id')->constrained()->onDelete('cascade');
            $table->text('description')->nullable(); // Description of experience with this framework
            $table->integer('experience_level')->default(1); // 1-5 scale
            $table->timestamps();
            
            $table->unique(['user_id', 'framework_id']);
        });

        // Other Technologies (custom technologies not in frameworks/languages)
        Schema::create('user_other_technologies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g., "Docker", "AWS", "Redis"
            $table->text('description')->nullable();
            $table->integer('experience_level')->default(1); // 1-5 scale
            $table->string('category')->nullable(); // e.g., "DevOps", "Database", "Cloud"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_other_technologies');
        Schema::dropIfExists('user_frameworks');
        Schema::dropIfExists('user_programming_languages');
    }
};
