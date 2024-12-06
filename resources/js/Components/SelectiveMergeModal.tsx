import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PokemonInstance {
    id: number;
    level: number;
    is_shiny: boolean;
    pokemon: {
        sprite_url: string;
    };
}

interface SelectiveMergeModalProps {
    pokemonName: string;
    excludedPokemonId: string;
    onClose: () => void;
}

const SelectiveMergeModal: React.FC<SelectiveMergeModalProps> = ({
    pokemonName,
    excludedPokemonId,
    onClose,
}) => {
    const [pokemonList, setPokemonList] = useState<PokemonInstance[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No authentication token found');

                const response = await axios.get('/api/user/pokemon', {
                    params: { search: pokemonName },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response)

                const filteredPokemon = response.data.data.filter(
                    (pokemon: PokemonInstance) => pokemon.id !== parseInt(excludedPokemonId)
                );

                setPokemonList(filteredPokemon);
            } catch (error) {
                console.error('Failed to fetch Pokémon list:', error);
            }
        };

        fetchPokemonList();
    }, [pokemonName, excludedPokemonId]);

    const handleToggleSelect = (id: number) => {
        setSelectedPokemon((prev) => {
            const updated = new Set(prev);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            return updated;
        });
    };

    const handleMerge = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.post(
                '/api/user/pokemon/merge',
                {
                    target_id: parseInt(excludedPokemonId),
                    merge_ids: Array.from(selectedPokemon),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setLoading(false);
            onClose();
        } catch (error) {
            console.error('Failed to merge Pokémon:', error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">Merge Pokémon</h2>
                <p className="text-gray-600 mb-6">
                    Select which {pokemonName}(s) to merge into this {pokemonName}.
                </p>

                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {pokemonList.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className={`p-4 h-16 border rounded-lg flex items-center justify-between ${
                                selectedPokemon.has(pokemon.id) ? 'border-blue-500' : 'border-gray-300'
                            }`}
                            onClick={() => handleToggleSelect(pokemon.id)}
                        >
                            <img
                                src={pokemon.pokemon.sprite_url}
                                alt={pokemonName}
                                className="w-16 h-16"
                            />

                            <h3>{pokemonName}</h3>

                            <div className="flex flex-col items-start flex-1 ml-4">
                                <p className="text-sm font-medium">Lvl: {pokemon.level}</p>
                                {Boolean(pokemon.is_shiny) && (
                                    <p className="text-xs text-yellow-500 font-bold">Shiny</p>
                                )}
                            </div>

                            <input
                                type="checkbox"
                                checked={selectedPokemon.has(pokemon.id)}
                                readOnly
                                className="block mx-auto mt-2"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={`px-4 py-2 ${
                            loading ? 'bg-gray-400' : 'bg-blue-600'
                        } text-white rounded-lg`}
                        disabled={loading}
                        onClick={handleMerge}
                    >
                        {loading ? 'Merging...' : 'Confirm Merge'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectiveMergeModal;
