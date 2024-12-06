<?php

namespace App\Console\Commands;

use App\Models\Pokemon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Console\Command;

class FetchPokemonData extends Command
{
    protected $signature = 'pokemon:fetch';
    protected $description = 'Fetch all Pokémon data from the Pokémon API';

    public function handle(): void
    {
        $client = new Client();

        for ($id = 1; $id <= 493; $id++) { // Fetch Gen 1 to 4 Pokémon
            try {
                // Fetch Pokémon data
                $response = $client->get("https://pokeapi.co/api/v2/pokemon/{$id}");
                $data = json_decode($response->getBody(), true);

                $spriteUrl = $data['sprites']['versions']['generation-iv']['heartgold-soulsilver']['front_default'] ?? null;
                $pokemonName = strtolower($data['name']);
                $cryUrl = "https://play.pokemonshowdown.com/audio/cries/{$pokemonName}.mp3";

                // Fetch species data to get evolution chain ID
                $speciesResponse = $client->get($data['species']['url']);
                $speciesData = json_decode($speciesResponse->getBody(), true);

                // Use the evolution chain URL with ID
                $evolutionChainId = $this->extractIdFromUrl($speciesData['evolution_chain']['url']);
                $evolutionResponse = $client->get("https://pokeapi.co/api/v2/evolution-chain/{$evolutionChainId}");
                $evolutionData = json_decode($evolutionResponse->getBody(), true);

                // Determine next evolution and level
                $nextEvolution = null;
                $evolutionLevel = null;

                $chain = $evolutionData['chain'];
                $nextEvolutionDetails = $this->getNextEvolution($chain, $data['name']);
                if ($nextEvolutionDetails) {
                    $nextEvolution = $nextEvolutionDetails['species_name'];
                    $evolutionLevel = $nextEvolutionDetails['min_level'];
                }

                Pokemon::query()->updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'name' => ucfirst($data['name']),
                        'type' => $data['types'][0]['type']['name'],
                        'type2' => $data['types'][1]['type']['name'] ?? null,
                        'hp' => $data['stats'][0]['base_stat'],
                        'attack' => $data['stats'][1]['base_stat'],
                        'defense' => $data['stats'][2]['base_stat'],
                        'special_attack' => $data['stats'][3]['base_stat'],
                        'special_defense' => $data['stats'][4]['base_stat'],
                        'speed' => $data['stats'][5]['base_stat'],
                        'base_experience' => $data['base_experience'],
                        'is_legendary' => $speciesData['is_legendary'] || $speciesData['is_mythical'],
                        'sprite_url' => $spriteUrl,
                        'cry_url' => $cryUrl,
                        'next_evolution' => $nextEvolution ? ucfirst($nextEvolution) : null,
                        'evolution_level' => $evolutionLevel,
                    ]
                );

                $this->info("Fetched and saved: " . ucfirst($data['name']));
            } catch (GuzzleException $e) {
                $this->error("Error fetching data for Pokémon ID {$id}: " . $e->getMessage());
            }
        }
    }

    private function extractIdFromUrl(string $url): int
    {
        $parts = explode('/', trim($url, '/'));
        return (int)end($parts);
    }

    private function getNextEvolution(array $chain, string $currentPokemon): ?array
    {
        if ($chain['species']['name'] === $currentPokemon) {
            if (isset($chain['evolves_to'][0])) {
                $evolution = $chain['evolves_to'][0];
                $levelDetail = $evolution['evolution_details'][0]['min_level'] ?? null;

                return [
                    'species_name' => $evolution['species']['name'],
                    'min_level' => $levelDetail,
                ];
            }

            return null; // No further evolution
        }

        foreach ($chain['evolves_to'] as $evolution) {
            $result = $this->getNextEvolution($evolution, $currentPokemon);
            if ($result) {
                return $result;
            }
        }

        return null;
    }
}
