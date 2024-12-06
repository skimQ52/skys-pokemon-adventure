<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    protected $table = "pokemons";

    protected $fillable = [
        'name',
        'type',
        'type2',
        'hp',
        'attack',
        'defense',
        'special_attack',
        'special_defense',
        'speed',
        'is_legendary',
        'sprite_url',
        'cry_url',
        'base_experience',
        'next_evolution',
        'evolution_level',
    ];
}
