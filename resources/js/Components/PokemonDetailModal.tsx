import React, {useEffect, useState} from 'react';
import axios from "axios";
import { motion } from "framer-motion";
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
    poke_level: number;
    isOpen: boolean;
    onClose: () => void;
    onPokemonReleased: () => void;
    onMergeComplete: () => void;
}

const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({
    id,
    pokemon,
    poke_level,
    isOpen,
    onClose,
    onPokemonReleased,
    onMergeComplete,
}) => {

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showEvolveDialog, setShowEvolveDialog] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [level, setLevel] = useState(0)
    const [isEvolving, setIsEvolving] = useState(false);
    const [evolvedPokemon, setEvolvedPokemon] = useState<PokemonDetails | null>(null);
    const [showMergeModal, setShowMergeModal] = useState(false);
    const [showMergeAnimation, setShowMergeAnimation] = useState(false);

    useEffect(() => {
        if (isOpen && pokemon) {
            const audio = new Audio(pokemon.cry_url);
            audio.play();
            setLevel(poke_level)
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

    const handleEvolve = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            setIsEvolving(true); // Start animation
            const response = await axios.post(
                `/api/user/pokemon/${id}/evolve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTimeout(() => {
                setEvolvedPokemon(response.data);
                setIsEvolving(false);
                const cryAudio = new Audio(response.data.cry_url);
                cryAudio.play();
            }, 5000);
        } catch (error) {
            console.error('Failed to evolve Pokémon:', error);
            setIsEvolving(false);
        }
    };

    const handleMerge = () => {
        setShowMergeModal(false);
        setShowMergeAnimation(true);
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
                            className={`px-4 py-2 ${
                                !pokemon?.evolution_level || level < pokemon.evolution_level
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600'
                            } text-white rounded-lg`}
                            onMouseEnter={() => setShowTooltip(level < pokemon?.evolution_level)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onClick={() => {
                                if (pokemon?.evolution_level && level >= pokemon.evolution_level) {
                                    setShowEvolveDialog(true);
                                }
                            }}
                        >
                            Evolve
                        </button>
                        {showTooltip && (
                            <div
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-700 text-white text-sm rounded shadow-lg">
                                Evolves to {pokemon.next_evolution} at Lvl {pokemon.evolution_level}
                            </div>
                        )}
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
                    onMergeComplete={handleMerge}
                />
            )}
            {showMergeAnimation && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
                        {/* Orbs Animation */}
                        <div className="relative w-full h-full">
                            {[...Array(10)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="absolute orb z-20"
                                    initial={{
                                        x: 180 + Math.random() * 200 - 100,
                                        y: 50 + Math.random() * 200 - 100,
                                        opacity: 0,
                                        scale: 1,
                                    }}
                                    animate={{
                                        x: 180,
                                        y: 30,
                                        opacity: 1,
                                        scale: 0,
                                        transition: {
                                            duration: 3,
                                            ease: "easeInOut",
                                            delay: index * 0.4, // Delay each orb by 0.5 seconds
                                        },
                                    }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        background: "radial-gradient(circle, #ffcc00, #ffa500)",
                                        borderRadius: "50%",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Pokémon Sprite */}
                        <motion.img
                            src={pokemon.sprite_url}
                            alt={pokemon.name}
                            className="z-10"
                            initial={{ scale: 2, opacity: 1 }}
                            animate={{ scale: 1, opacity: 0 }}
                            transition={{ delay: 6, duration: 0.5}}
                        />

                        {/* Success Message */}
                        <motion.div
                            className="absolute text-center mt-8 text-xl font-bold text-green-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 6.5, duration: 1 }}
                        >
                            Success! Your <strong>{pokemon.name}</strong> has gotten stronger!
                        </motion.div>

                        {/* Close Button */}
                        <motion.button
                            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 7, duration: 1 }}
                            onClick={() => {
                                setShowMergeAnimation(false);
                                onClose();
                                onMergeComplete();
                            }}
                        >
                            Continue
                        </motion.button>
                    </div>
                </div>
            )}
            {showEvolveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Evolve Pokémon</h3>
                        <p className="text-gray-600 mb-6 text-center">
                            Are you sure you want to evolve {pokemon.name}? This action is irreversible!
                        </p>
                        <div className="flex justify-between gap-3">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                                onClick={() => setShowEvolveDialog(false)}
                            >
                                No, I'm not ready.
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                onClick={handleEvolve}
                            >
                                Yes, I'm sure!
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isEvolving && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
                        <div className="flashing-animation">
                            <img
                                src={pokemon.sprite_url}
                                alt={pokemon.name}
                                className="w-80 h-80 flashing-pokemon"
                            />
                        </div>
                    </div>
                </div>
            )}
            {evolvedPokemon && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
                        <p className="text-center mb-6">
                            Your <strong>{pokemon.name}</strong> has evolved into <strong>{evolvedPokemon.name}</strong>!
                        </p>
                        <img
                            src={evolvedPokemon.sprite_url}
                            alt={evolvedPokemon.name}
                            className="w-80 h-80"
                        />
                        <button
                            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={() => {
                                setShowEvolveDialog(false);
                                setEvolvedPokemon(null);
                                onMergeComplete();
                                onClose();
                            }}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonDetailModal;
