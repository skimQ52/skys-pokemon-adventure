<?php

namespace App\Http\Controllers;

use App\Models\user;
use App\Services\PokemonService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function catchPokemon(): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        $pokemonService = new PokemonService();

        // Select a weighted random Pokémon based on the user's level
        $pokemon = $pokemonService->spawnPokemon($user);

        // Generate a level for the caught Pokémon, capped at the user's level
        $level = rand(1, $user->level);

        // Does the pokemon run away or not
        $isRunAway = $pokemonService->shouldPokemonRunAway($pokemon->base_experience, $user->level, $level);

        if ($isRunAway) {
            return response()->json([
                'message' => "You encountered a {$pokemon->name}, but it got away.",
            ]);
        }

        $isShiny = rand(1,8000) == 8000;

        // Add the Pokémon to the user's collection
        $userPokemon = $user->pokemons()->create([
            'pokemon_id' => $pokemon->id,
            'level' => $level,
            'is_shiny' => $isShiny,
        ]);

        // Award XP to the user based on the Pokémon's HP stat
        $user->increment('xp', $pokemon->hp);

        // Check if the user has leveled up
//        if ($user->xp >= $this->getXpRequiredForNextLevel($user->level)) {
//            $user->level++;
//            $user->save();
//        }

        return response()->json([
            'message' => "You caught a {$pokemon->name}!",
            'pokemon' => $userPokemon,
        ]);
    }
}
