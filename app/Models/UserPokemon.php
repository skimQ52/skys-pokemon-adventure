<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPokemon extends Model
{

    protected $table = 'user_pokemons';
    protected $fillable = [
        'user_id',
        'pokemon_id',
        'level',
        'experience',
        'is_shiny',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pokemon(): BelongsTo
    {
        return $this->belongsTo(Pokemon::class);
    }
}
