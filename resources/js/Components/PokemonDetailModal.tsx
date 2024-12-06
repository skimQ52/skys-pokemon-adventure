import React, {useEffect, useState} from 'react';
import axios from "axios";
import SelectiveMergeModal from "./SelectiveMergeModal";

interface PokemonDetails {
    id: number;
    name: string;
    type: string;
    type2: string | null;
    sprite_url: string;
    cry_url: string;
    next_evolution: string;
    evolution_level: number;
}

interface PokemonDetailModalProps {
    id: string;
    pokemon: PokemonDetails | null;
    level: number;
    isOpen: boolean;
    onClose: () => void;
    onPokemonReleased: () => void;
}

const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({
    id,
    pokemon,
    level,
    isOpen,
    onClose,
    onPokemonReleased,
}) => {

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showMergeModal, setShowMergeModal] = useState(false);

    useEffect(() => {
        if (isOpen && pokemon) {
            const audio = new Audio(pokemon.cry_url);
            audio.play();
        }
    }, [isOpen, pokemon]);

    if (!isOpen || !pokemon) return null;

    const handleSpriteClick = () => {
        const audio = new Audio(pokemon.cry_url);
        audio.play();
    };

    const handleRelease = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            // noinspection JSAnnotator
            await axios.delete(`/api/user/pokemon/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowConfirmDialog(false);
            onClose();
            onPokemonReleased(); // Trigger callback to refresh collection or UI
        } catch (error) {
            console.error('Failed to release Pokémon:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">

                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>

                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">{pokemon.name}</h2>
                    <p className="text-gray-600 mb-2">Level: {level}</p>

                    {/* Types */}
                    <div className="flex gap-2 mb-4">
                        <span className={`px-3 py-1 bg-${pokemon.type}-600 text-black rounded-full`}>
                            {pokemon.type}
                        </span>
                        {pokemon.type2 && (
                            <span className={`px-3 py-1 bg-${pokemon.type2}-600 text-black rounded-full`}>
                                {pokemon.type2}
                            </span>
                        )}
                    </div>

                    <img
                        src={pokemon.sprite_url}
                        alt={pokemon.name}
                        className="w-80 h-80 cursor-pointer"
                        onClick={handleSpriteClick}
                    />

                    <div className="flex justify-between w-full mt-6">
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            onClick={() => setShowConfirmDialog(true)}
                        >
                            Release
                        </button>
                        <button
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                            onClick={() => setShowMergeModal(true)}
                        >
                            Merge
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={() => console.log(`Evolve at ${pokemon?.evolution_level}`)}
                        >
                            Evolve
                        </button>
                    </div>
                </div>
            </div>
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Release Pokémon</h3>
                        <p className="text-gray-600 mb-6 text-center">
                            Are you sure you want to release {pokemon.name}? This action cannot be undone.
                        </p>
                        <div className="flex justify-between gap-3">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                                onClick={() => setShowConfirmDialog(false)}
                            >
                                No, I've changed my mind!
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                onClick={handleRelease}
                            >
                                Yes, set {pokemon.name} free.
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showMergeModal && (
                <SelectiveMergeModal
                    pokemonName={pokemon.name}
                    excludedPokemonId={id}
                    onClose={() => setShowMergeModal(false)}
                />
            )}
        </div>
    );
};

export default PokemonDetailModal;