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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('name');
            $table->string('phone')->nullable()->after('email');
            $table->string('location')->nullable()->after('phone');
            $table->string('linkedin_url')->nullable()->after('location');
            $table->string('github_url')->nullable()->after('linkedin_url');
            $table->date('born_date')->nullable()->after('github_url');
            $table->string('profession')->nullable()->after('born_date');
            $table->text('description')->nullable()->after('profession');
            $table->string('profile_image')->nullable()->after('description');
            $table->string('theme_color')->default('#3b82f6')->after('profile_image'); // Default blue color
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'phone',
                'location',
                'linkedin_url',
                'github_url',
                'born_date',
                'profession',
                'description',
                'profile_image',
                'theme_color'
            ]);
        });
    }
};
