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
        Schema::table('user_education', function (Blueprint $table) {
            // Add new date fields
            $table->date('start_date')->nullable()->after('field_of_study');
            $table->date('end_date')->nullable()->after('start_date');
            $table->boolean('is_current')->default(false)->after('end_date');
            
            // Drop old year fields if they exist
            if (Schema::hasColumn('user_education', 'start_year')) {
                $table->dropColumn('start_year');
            }
            if (Schema::hasColumn('user_education', 'end_year')) {
                $table->dropColumn('end_year');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_education', function (Blueprint $table) {
            // Add back old fields
            $table->string('start_year')->nullable();
            $table->string('end_year')->nullable();
            
            // Drop new fields
            $table->dropColumn(['start_date', 'end_date', 'is_current']);
        });
    }
};
