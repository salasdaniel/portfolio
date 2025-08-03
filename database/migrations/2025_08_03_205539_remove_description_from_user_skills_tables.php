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
        Schema::table('user_programming_languages', function (Blueprint $table) {
            $table->dropColumn('description');
        });

        Schema::table('user_frameworks', function (Blueprint $table) {
            $table->dropColumn('description');
        });

        Schema::table('user_other_technologies', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_programming_languages', function (Blueprint $table) {
            $table->text('description')->nullable();
        });

        Schema::table('user_frameworks', function (Blueprint $table) {
            $table->text('description')->nullable();
        });

        Schema::table('user_other_technologies', function (Blueprint $table) {
            $table->text('description')->nullable();
        });
    }
};
