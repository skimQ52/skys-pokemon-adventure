<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\EncounterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [LoginController::class, 'apiLogin']);

Route::post('/encounter', [EncounterController::class, 'encounter'])->name('encounter')->middleware('auth:sanctum');
