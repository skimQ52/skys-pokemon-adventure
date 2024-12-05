<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserPokemonResource;
use Illuminate\Http\Request;

class PokemonController extends Controller
{
    public function getUserPokemons(Request $request)
    {
        // Fetch the authenticated user and their related pokemons (through the user_pokemons table)
        /** @var User $user */
        $user = auth()->user();

        // Load the user_pokemons relationship with the related pokemon data
        $userPokemons = $user->userPokemons()->with('pokemon')->get();

        // Return the user pokemons as a resource collection
        return UserPokemonResource::collection($userPokemons);
    }

    public function getUserPokemon(Request $request, $pokemonId)
    {
        /** @var User $user */
        $user = auth()->user();

        // Find the user Pokémon by ID and ensure it belongs to the authenticated user
        $userPokemon = $user->userPokemons()
            ->where('id', $pokemonId)
            ->with('pokemon') // Include the related Pokemon data
            ->first();

        // If no such user Pokémon exists, return an error
        if (!$userPokemon) {
            return response()->json(['message' => 'Pokemon not found in your collection.'], 404);
        }

        // Return the specific user's Pokémon as a resource
        return new UserPokemonResource($userPokemon);
    }
}
