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
        return [
            'id' => $this->id,
            'level' => $this->level,
            'is_shiny' => $this->is_shiny,
            'pokemon' => [
                'id' => $this->pokemon->id,
                'name' => $this->pokemon->name,
                'type' => $this->pokemon->type,
                'type_2' => $this->pokemon->type_2,
                'sprite_url' => $this->pokemon->sprite_url,
                'cry_url' => $this->pokemon->cry_url,
            ],
        ];
    }
}
