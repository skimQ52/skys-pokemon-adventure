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
        Schema::create('pokemons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default("normal");
            $table->string('type2')->nullable();
            $table->integer('hp')->default(1);
            $table->integer('attack')->default(1);
            $table->integer('defense')->default(1);
            $table->integer('special_attack')->default(1);
            $table->integer('special_defense')->default(1);
            $table->integer('speed')->default(1);
            $table->boolean('is_legendary')->default(false);
            $table->string('sprite_url')->nullable();
            $table->string('cry_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pokemon');
    }
};
