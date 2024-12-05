import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

interface Pokemon {
    id: number;
    name: string;
    level: number;
    is_shiny: boolean;
    sprite_url: string;
}

export default function Collection() {
    const [userPokemons, setUserPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserPokemons = async (): Promise<void> => {
            try {
                const response = await axios.get<Pokemon[]>('/api/user/pokemons');
                setUserPokemons(response.data); // Assuming the response is a list of Pokémon
            } catch (error) {
                console.error('Error fetching user Pokémon:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPokemons();
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Collection" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-xl font-semibold mb-4">Your Pokémon Collection</h2>

                            {loading ? (
                                <p>Loading your Pokémon...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userPokemons.map((pokemon) => (
                                        <div
                                            key={pokemon.id}
                                            className="p-4 border rounded-lg shadow-lg"
                                        >
                                            <h3 className="text-lg font-bold">{pokemon.name}</h3>
                                            <p>Level: {pokemon.level}</p>
                                            <p>Shiny: {pokemon.is_shiny ? 'Yes' : 'No'}</p>
                                            <img
                                                src={pokemon.sprite_url}
                                                alt={pokemon.name}
                                                className="w-32 h-32 object-cover mt-4"
                                            />
                                        </div>
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
