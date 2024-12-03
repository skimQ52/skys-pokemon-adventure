<?php

namespace App\Services;

use App\Models\Pokemon;
use App\Models\User;

class PokemonService
{
    public function spawnPokemon(User $user)
    {
        $maxLevel = $user->level;
        $pokemons = Pokemon::where('base_experience', '<=', 40 + $maxLevel * 5)->get(); // Filter Pokemon within a reasonable range of base_experience

        // Weight calculation: Inverse proportional weighting
        $weights = $pokemons->mapWithKeys(function ($pokemon) {
            return [$pokemon->id => 1 / max(1, $pokemon->base_experience)];
        });

        // Calculate the sum of all weights
        $totalWeight = $weights->sum();

        // Generate a random number between 0 and totalWeight
        $randomNumber = mt_rand() / mt_getrandmax() * $totalWeight;

        // Find the selected Pokémon based on weighted randomness
        $cumulativeWeight = 0;
        foreach ($weights as $pokemonId => $weight) {
            $cumulativeWeight += $weight;
            if ($randomNumber <= $cumulativeWeight) {
                return Pokemon::find($pokemonId);
            }
        }

        return $pokemons->first(); // Fallback if something goes wrong
    }
}
