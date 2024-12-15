import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Pokemon {
    name: string;
    level: number;
    is_shiny: boolean;
    sprite_url: string;
    cry_url: string;
}

interface EncounterModalProps {
    caught: boolean; // Whether the Pokémon was caught or ran away
    message: string; // Message to display (either caught message or runaway message)
    pokemon?: Pokemon; // Only pass pokemon data if caught
    closeModal: () => void;
}

export default function EncounterModal({ caught, message, pokemon, closeModal }: EncounterModalProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
            }
        }, 3500); // Match the Pokémon reveal delay (2.5s)

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    // Function to handle replaying the audio when the sprite is clicked
    const handleReplayAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Rewind to the beginning
            audioRef.current.play(); // Play the audio
        }
    };

    return (
        <div className="fixed inset-0 z-50 items-center flex flex-col justify-center bg-black bg-opacity-50">
            <motion.h2
                className="text-2xl text-white font-bold mb-4"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 3.5, duration: 0.8}}
            >
                Pokémon Encountered!
            </motion.h2>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 3.8, duration: 0.8}}
                className="z-50"
            >
                <h3 className="text-lg mb-4 text-white">{message}</h3>

                {caught && pokemon && (
                    <div>
                        <p className="text-2xl text-yellow-300">Lvl: {pokemon.level}</p>
                        <audio ref={audioRef} style={{display: 'none'}}>
                            <source src={pokemon.cry_url} type="audio/mpeg"/>
                        </audio>
                    </div>
                )}

                {!caught && (
                    <img
                        src="/images/runaway-sprite.png" // You can use a generic runaway sprite
                        alt="Runaway"
                        className="w-32 h-32 object-cover my-4"
                    />
                )}
            </motion.div>

            {/* Left Bush Animation */}
            <motion.img
                src="/assets/left_bush.svg"
                alt="Left Bush"
                className="z-20 absolute bottom-0"
                initial={{x: -50, y: -25, opacity: 1}}
                animate={{x: -300, opacity: 1}}
                transition={{delay: 1.7, duration: 1}}
            />

            {/* Center Bush Animation */}
            <motion.img
                src="/assets/center_bush.svg"
                alt="Center Bush"
                className="z-30 absolute bottom-0"
                initial={{x: 0, opacity: 1}}
                animate={{x: 300, opacity: 1}}
                transition={{delay: 1, duration: 1}}
            />

            {/* Right Bush Animation */}
            <motion.img
                src="/assets/right_bush.svg"
                alt="Right Bush"
                className="z-10 absolute bottom-0"
                initial={{x: 50, y: -30, opacity: 1}}
                animate={{x: 250, opacity: 1}}
                transition={{delay: 2.4, duration: 1}}
            />

            {/* Pokémon Reveal */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 3, duration: 1}}
                className="z-40 relative flex flex-col items-center"
            >
                {caught && pokemon && (
                    <div className="relative">
                        {/* Shadow */}
                        <div
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-36 h-12 bg-black opacity-50 rounded-full blur-md"
                        ></div>

                        {/* Pokémon Sprite */}
                        <motion.img
                            src={pokemon.sprite_url}
                            alt={pokemon.name}
                            className="relative w-72 h-72 object-cover"
                            initial={{scale: 0, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{delay: 2.5, duration: 0.8}}
                            onClick={handleReplayAudio}
                        />
                    </div>
                )}

                <button
                    onClick={closeModal}
                    className="mt-4 px-10 py-4 text-white text-2xl bg-green-500 rounded-md hover:bg-green-600"
                >
                    Okay
                </button>
            </motion.div>
        </div>
    );
}
