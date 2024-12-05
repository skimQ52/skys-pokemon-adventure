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
        $user = $request->user();

        // Load the user_pokemons relationship with the related pokemon data
        $userPokemons = $user->userPokemons()->with('pokemon')->get();

        // Return the user pokemons as a resource collection
        return UserPokemonResource::collection($userPokemons);
    }
}
