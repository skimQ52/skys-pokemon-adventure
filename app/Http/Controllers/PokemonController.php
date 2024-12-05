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

        // Start by querying the user's pokemons and eager load related pokemon data
        $query = $user->userPokemons()->with('pokemon');

        // Search by Pokemon name
        if ($request->has('search') && $request->search != '') {
            $query->whereHas('pokemon', function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by type
        if ($request->has('type') && $request->type != '') {
            $query->whereHas('pokemon', function ($query) use ($request) {
                $query->where('type', $request->type)
                    ->orWhere('type2', $request->type);
            });
        }

        // Handle sorting options
        if ($request->has('sort_by')) {
            switch ($request->sort_by) {
                case 'level_asc':
                    $query->orderBy('level', 'asc');
                    break;
                case 'level_desc':
                    $query->orderBy('level', 'desc');
                    break;
                case 'pokedex':
                    $query->orderBy('pokemon_id', 'asc'); // Sort by Pokemon ID (Pokedex number)
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'most_recent':
                default:
                    $query->orderBy('created_at', 'desc'); // Default: Sort by most recent
                    break;
            }
        }

        // Get the filtered and sorted pokemons
        $userPokemons = $query->get();

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
