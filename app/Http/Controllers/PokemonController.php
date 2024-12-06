<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserPokemonResource;
use App\Models\UserPokemon;
use App\Services\PokemonService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class PokemonController extends Controller
{

    protected PokemonService $pokemonService;

    public function __construct(PokemonService $pokemonService)
    {
        $this->pokemonService = $pokemonService;
    }

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

    public function release($id)
    {
        /** @var User $user */
        $user = auth()->user();

        $userPokemon = $user->userPokemons()->findOrFail($id);
        $userPokemon->delete();

        return response()->json(['message' => 'Pokémon released successfully']);
    }

    public function merge(Request $request)
    {
        $request->validate([
            'target_id' => 'required|integer|exists:user_pokemons,id',
            'merge_ids' => 'required|array',
            'merge_ids.*' => 'integer|exists:user_pokemons,id',
        ]);

        /** @var User $user */
        $user = auth()->user();

        $targetPokemon = $user->userPokemons()
            ->where('id', $request->target_id)
            ->firstOrFail();

        // Fetch Pokémon to be merged
        $mergePokemons = $user->userPokemons()
            ->whereIn('id', $request->merge_ids)
            ->get();

        if ($mergePokemons->isEmpty()) {
            return response()->json(['error' => 'No valid Pokémon to merge.'], 400);
        }
        $newLevel = $this->pokemonService->getNewLevelFromMerge($targetPokemon->level, $mergePokemons);

        // Update the target Pokémon's level
        $targetPokemon->level = $newLevel;
        $targetPokemon->save();

        // Delete the merged Pokémon
        $user->userPokemons()
            ->whereIn('id', $request->merge_ids)
            ->delete();

        return response()->json([
            'message' => 'Pokémon merged successfully!',
            'target_pokemon' => [
                'id' => $targetPokemon->id,
                'level' => $targetPokemon->level,
            ],
        ]);
    }

}
