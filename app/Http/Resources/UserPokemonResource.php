<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserPokemonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        // Returning related Pokemon data along with UserPokemon attributes
        $spriteURL = $this->pokemon->sprite_url;
        if ($this->is_shiny) {
            $spriteURL = $this->makeSpriteUrlShiny($spriteURL);
        }

        return [
            'id' => $this->id,
            'level' => $this->level,
            'is_shiny' => $this->is_shiny,
            'pokemon' => [
                'id' => $this->pokemon->id,
                'name' => $this->pokemon->name,
                'type' => $this->pokemon->type,
                'type2' => $this->pokemon->type2,
                'sprite_url' => $spriteURL,
                'cry_url' => $this->pokemon->cry_url,
                'next_evolution' => $this->pokemon->next_evolution,
                'evolution_level' => $this->pokemon->evolution_level,
            ],
        ];
    }

    public function makeSpriteUrlShiny($spriteURL): string|array|null
    {
        return preg_replace('/(\/[0-9]+\.png)$/', '/shiny$1', $spriteURL);
    }
}
