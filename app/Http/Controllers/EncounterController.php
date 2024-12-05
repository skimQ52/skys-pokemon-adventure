<?php

namespace App\Http\Controllers;

use App\Models\user;
use App\Services\PokemonService;
use Illuminate\Http\JsonResponse;

class EncounterController extends Controller
{
    public function encounter(): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        $pokemonService = new PokemonService();

        // Select a weighted random Pokémon based on the user's level
        $pokemon = $pokemonService->spawnPokemon($user);

        // Generate a level for the caught Pokémon, capped at the user's level, hard-capped at 100
        $level = min(max(rand(1, $user->level), 1), 100);

        // Does the pokemon run away or not
        $isRunAway = $pokemonService->shouldPokemonRunAway($pokemon->base_experience, $user->level, $level);

        if ($isRunAway) {
            return response()->json([
                'message' => "You encountered a {$pokemon->name}, but it got away.",
            ]);
        }

        $isShiny = rand(1,8000) == 8000;

        // Add the Pokémon to the user's collection
        $userPokemon = $user->userPokemons()->create([
            'pokemon_id' => $pokemon->id,
            'level' => $level,
            'is_shiny' => $isShiny,
        ]);

        // Award XP to the user based on the Pokémon's HP stat
        $user->increment('xp', $pokemon->hp);

        // Check if the user has leveled up
        $user->update([
            'level' => $user->getLevelFromXp($user->xp),
        ]);

        return response()->json([
            'message' => "You caught a {$pokemon->name}! And gained {$pokemon->hp} experience.",
            'pokemon' => $userPokemon,
        ]);
    }
}
