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
        Schema::table('user_pokemons', function (Blueprint $table) {
            // Drop the existing foreign key
            $table->dropForeign(['pokemon_id']);

            // Add the correct foreign key constraint
            $table->foreign('pokemon_id')->references('id')->on('pokemons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_pokemons', function (Blueprint $table) {
            // Rollback: Drop the new foreign key and add the old one back
            $table->dropForeign(['pokemon_id']);
            $table->foreign('pokemon_id')->references('id')->on('pokemon')->onDelete('cascade');
        });
    }
};
