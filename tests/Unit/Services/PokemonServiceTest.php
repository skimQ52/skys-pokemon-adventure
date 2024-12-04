<?php

namespace Tests\Unit\Services;

use App\Models\Pokemon;
use App\Models\User;
use App\Services\PokemonService;
use Database\Factories\UserFactory;
use Tests\TestCase;

class PokemonServiceTest extends TestCase
{
    public function test_it_spawns_a_pokemon(): void
    {
        // Arrange: Create a test user
        $user = User::factory()->create([
            'level' => 5,  // Set user's level to 5 for testing
        ]);

        // Arrange: Create multiple Pokémon with varying base_experience values
        $pokemon1 = Pokemon::create([
            'name' => 'Bulbasaur',
            'base_experience' => 64,
            'hp' => 45,
            'attack' => 62,
            'special_attack' => 62,
            'defense' => 63,
            'special_defense' => 63,
            'speed' => 63,
            'sprite' => 'bulbasaur.png',
            'cry' => 'bulbasaur_cry.mp3',
        ]);

        $pokemon2 = Pokemon::create([
            'name' => 'Ivysaur',
            'base_experience' => 142,
            'hp' => 60,
            'attack' => 62,
            'special_attack' => 62,
            'defense' => 63,
            'special_defense' => 63,
            'speed' => 63,
            'sprite' => 'ivysaur.png',
            'cry' => 'ivysaur_cry.mp3',
        ]);

        $pokemon3 = Pokemon::create([
            'name' => 'Venusaur',
            'base_experience' => 236,
            'hp' => 80,
            'attack' => 62,
            'special_attack' => 62,
            'defense' => 63,
            'special_defense' => 63,
            'speed' => 63,
            'sprite' => 'venusaur.png',
            'cry' => 'venusaur_cry.mp3',
        ]);

        // Act: Use PokemonService to get a weighted random Pokémon
        $pokemonService = new PokemonService();
        $spawnedPokemon = $pokemonService->spawnPokemon($user);

        // Assert: Ensure that a Pokémon is selected and it's from the available ones
        $this->assertNotNull($spawnedPokemon);
        $this->assertTrue($spawnedPokemon instanceof Pokemon);

        // Assert: Check that the Pokémon's level is capped at the user's level (5)
        $this->assertTrue($spawnedPokemon->level <= $user->level);

        // Assert: Check that the Pokémon selected has a base_experience less than or equal to the max level * 10
        $this->assertTrue($spawnedPokemon->base_experience <= 40 + $user->level * 5);

    }

    /** @test */
    public function it_awards_xp_based_on_pokemon_hp() // TODO: Move this test to UserController or wherever the encounter endpoint ends up
    {
        // Arrange: Create a user
        $user = User::factory()->create([
            'xp' => 0,
        ]);

        // Arrange: Create a test Pokémon
        $pokemon = Pokemon::create([
            'name' => 'Bulbasaur',
            'base_experience' => 64,
            'hp' => 45,
            'attack' => 62,
            'special_attack' => 62,
            'defense' => 63,
            'special_defense' => 63,
            'speed' => 63,
            'sprite' => 'bulbasaur.png',
            'cry' => 'bulbasaur_cry.mp3',
        ]);

        // Act: Call the catchPokemon function or manually associate Pokémon
        $pokemonService = new PokemonService();
        $userPokemon = $pokemonService->catchPokemon($user, $pokemon);

        // Assert: Ensure the user's XP is incremented by the Pokémon's HP
        $this->assertEquals(45, $user->xp);
    }
}
