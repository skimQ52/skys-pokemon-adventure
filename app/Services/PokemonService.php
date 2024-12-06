<?php

namespace App\Services;

use App\Models\Pokemon;
use App\Models\User;
use Illuminate\Support\Collection;

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

        $runawayChance = max(10, min($runawayChance, 90));

        $randomChance = rand(0, 100);

        return $randomChance < $runawayChance;
    }

    public function getNewLevelFromMerge(int $level, Collection $mergePokemons): mixed
    {
        // Initialize variables
        $totalLevelGain = 0;
        $currentTargetLevel = $level;

        // Calculate level gain based on diminishing returns
        foreach ($mergePokemons as $mergePokemon) {
            // Diminishing returns formula: merge Pokémon's level * scaling factor
            // Scaling factor reduces as the target level increases
            $scalingFactor = 1 / (1 + ($currentTargetLevel / 50)); // Example: higher target levels reduce scaling
            $levelGain = floor($mergePokemon->level * $scalingFactor);

            // Add to total level gain
            $totalLevelGain += $levelGain;

            // Update the target level for the next iteration to apply diminishing returns
            $currentTargetLevel += $levelGain;
        }

        // Cap levels to a max of 100
        return min($level + $totalLevelGain, 100);
    }
}
