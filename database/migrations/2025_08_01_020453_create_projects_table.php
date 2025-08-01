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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('programming_languages')->nullable(); // e.g: "PHP, JavaScript"
            $table->string('frameworks')->nullable();            // e.g: "Laravel, React"
            $table->string('tags')->nullable();                  // e.g: "Web, Fintech, API"
            $table->string('environment')->nullable();           // e.g: "Localhost, AWS, Vercel"
            $table->string('repo_url')->nullable();              // GitHub or GitLab
            $table->string('live_url')->nullable();              // Demo link or production site
            $table->string('image_url')->nullable();             // Project image or thumbnail
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
