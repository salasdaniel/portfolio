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
        Schema::table('user_certifications', function (Blueprint $table) {
            // Remove grade column and add certification_url
            $table->dropColumn('grade');
            $table->string('certification_url')->nullable()->after('description');
            
            // Add pin_order column with unique constraint per user
            $table->integer('pin_order')->nullable()->after('sort_order');
            $table->unique(['user_id', 'pin_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_certifications', function (Blueprint $table) {
            // Restore grade column
            $table->string('grade')->nullable()->after('description');
            
            // Remove certification_url and pin_order
            $table->dropUnique(['user_id', 'pin_order']);
            $table->dropColumn(['certification_url', 'pin_order']);
        });
    }
};
