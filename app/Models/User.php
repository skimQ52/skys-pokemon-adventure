<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'level',
        'xp',
    ];

    protected $attributes = [
        'level' => 0,
        'xp' => 0
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userPokemons(): HasMany
    {
        return $this->hasMany(UserPokemon::class);
    }

    public function getLevelFromXp(int $xp): int
    {
        $level = 0;
        $xpForNextLevel = self::xpRequiredForLevel($level);

        while ($xp >= $xpForNextLevel) {
            $xp -= $xpForNextLevel;
            $level++;
            $xpForNextLevel = self::xpRequiredForLevel($level);
        }

        return $level;
    }

    private static function xpRequiredForLevel(int $level): int
    {
        $A = 20; // Quadratic coefficient
        $B = 30; // Linear coefficient
        return $A * ($level ** 2) + $B * $level;
    }
}
