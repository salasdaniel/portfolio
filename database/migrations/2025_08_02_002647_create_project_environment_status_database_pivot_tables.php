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
        // Project Environment pivot table
        Schema::create('project_environment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('environment_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['project_id', 'environment_id']);
        });

        // Project Status pivot table
        Schema::create('project_status', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('status_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['project_id', 'status_id']);
        });

        // Project Database pivot table
        Schema::create('project_database', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('database_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['project_id', 'database_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_database');
        Schema::dropIfExists('project_status');
        Schema::dropIfExists('project_environment');
    }
};
