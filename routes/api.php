<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\EncounterController;
use App\Http\Controllers\PokemonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [LoginController::class, 'apiLogin'])->name('api.login');

Route::post('/encounter', [EncounterController::class, 'encounter'])->name('encounter')->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user/pokemon/{pokemonId}', [PokemonController::class, 'getUserPokemon']);
Route::middleware('auth:sanctum')->delete('/user/pokemon/{pokemonId}', [PokemonController::class, 'release']);
Route::middleware('auth:sanctum')->post('/user/pokemon/{pokemonId}/evolve', [PokemonController::class, 'evolve']);
Route::middleware('auth:sanctum')->post('/user/pokemon/merge', [PokemonController::class, 'merge']);
Route::get('/user/pokemon', [PokemonController::class, 'getUserPokemons'])->name('user.pokemons')->middleware('auth:sanctum');
