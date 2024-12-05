<?php

namespace App\Services;

use App\Models\Pokemon;
use App\Models\User;

class PokemonService
{
    public function spawnPokemon(User $user)
    {
        $pokemons = Pokemon::query()->where('base_experience', '<=', 40 + $user->level * 5)->get();

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

    public function shouldPokemonRunAway(int $baseExperience, int $userLevel, int $pokemonLevel): bool
    {
        // Normalize values into a weighted percentage range (0-100).
        $baseExpWeight = min($baseExperience / 10, 100); // Higher base experience increases runaway chance
        $pokemonLevelWeight = min(($pokemonLevel / 100) * 50, 50); // Higher Pokémon level increases runaway chance
        $userLevelWeight = min(($userLevel / 100) * 50, 50); // Higher user level decreases runaway chance

        // Calculate the final runaway chance (higher values mean higher chance of running away)
        $runawayChance = $baseExpWeight + $pokemonLevelWeight - $userLevelWeight;

        $runawayChance = max(5, min($runawayChance, 95));

        $randomChance = rand(0, 100);

        return $randomChance < $runawayChance;
    }
}
