import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import PokemonCard from '../Components/PokemonCard';

interface PokemonDetails {
    id: number;
    name: string;
    type: string;
    type2: string | null;
    sprite_url: string;
    cry_url: string;
}

interface Pokemon {
    id: number;
    level: number;
    is_shiny: boolean;
    pokemon: PokemonDetails;
}

export default function Collection() {
    const [userPokemons, setUserPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('most_recent'); // Default sorting by most recent

    useEffect(() => {
        const fetchUserPokemons = async (): Promise<void> => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('User is not authenticated');
                    return;
                }

                const response = await axios.get<Pokemon[]>('/api/user/pokemon', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    params: {
                        search: searchTerm,
                        type: typeFilter,
                        sort_by: sortBy,
                    },
                });
                setUserPokemons(response.data.data);
            } catch (error) {
                console.error('Error fetching user Pokémon:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPokemons();
    }, [searchTerm, typeFilter, sortBy]); // Re-fetch data whenever search, typeFilter, or sortBy changes

    return (
        <AuthenticatedLayout>
            <Head title="Collection" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-gray-600 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-xl font-semibold mb-4 text-white">Your Pokémon Collection</h2>

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">

                                <div className="flex-1 sm:w-3/5">
                                    <input
                                        type="text"
                                        placeholder="Search Pokémon"
                                        className="px-4 py-2 w-full border rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="w-full sm:w-1/5">
                                    <select
                                        className="px-4 py-2 w-full border rounded-lg"
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="water">Water</option>
                                        <option value="fire">Fire</option>
                                        <option value="grass">Grass</option>
                                        <option value="bug">Bug</option>
                                        <option value="flying">Flying</option>
                                        <option value="normal">Normal</option>
                                        <option value="fairy">Fairy</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="electric">Electric</option>
                                        <option value="fighting">Fighting</option>
                                        <option value="dark">Dark</option>
                                        <option value="ghost">Ghost</option>
                                        <option value="steel">Steel</option>
                                        <option value="dragon">Dragon</option>
                                        <option value="ground">Ground</option>
                                        <option value="poison">Poison</option>
                                        <option value="rock">Rock</option>
                                        <option value="ice">Ice</option>
                                    </select>
                                </div>

                                <div className="w-full sm:w-1/5">
                                    <select
                                        className="px-4 py-2 w-full border rounded-lg"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="most_recent">Most Recent</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="level_asc">Lowest Level</option>
                                        <option value="level_desc">Highest Level</option>
                                        <option value="pokedex">Pokédex Number</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <p>Loading your Pokémon...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userPokemons.map((pokemon) => (
                                        <PokemonCard key={pokemon.id} pokemon={pokemon.pokemon} level={pokemon.level}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
