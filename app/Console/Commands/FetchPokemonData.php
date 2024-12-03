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

        for ($id = 1; $id <= 493; $id++) { // Fetch gen 1 to 4
            try {
                $response = $client->get("https://pokeapi.co/api/v2/pokemon/{$id}");
                $data = json_decode($response->getBody(), true);

                $spriteUrl = $data['sprites']['versions']['generation-iv']['heartgold-soulsilver']['front_default'] ?? null;
                $pokemonName = strtolower($data['name']);

                $cryUrl = "https://play.pokemonshowdown.com/audio/cries/{$pokemonName}.mp3";

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
                        'is_legendary' => false, // Placeholder
                        'sprite_url' => $spriteUrl,
                        'cry_url' => $cryUrl,
                    ]
                );

                $this->info("Fetched and saved: " . ucfirst($data['name']));
            } catch (GuzzleException $e) {
                $this->error($e);
            }
        }
    }
}
