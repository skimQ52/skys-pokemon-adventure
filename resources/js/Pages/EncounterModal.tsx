import React, { useEffect, useRef } from 'react';

interface Pokemon {
    name: string;
    level: number;
    is_shiny: boolean;
    sprite_url: string;
    cry_url: string;
}

interface EncounterModalProps {
    caught: boolean;  // Whether the Pokémon was caught or ran away
    message: string;  // Message to display (either caught message or runaway message)
    pokemon?: Pokemon;  // Only pass pokemon data if caught
    closeModal: () => void;
}

export default function EncounterModal({ caught, message, pokemon, closeModal }: EncounterModalProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Play the sound automatically when the modal is opened
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    }, []);

    // Function to handle replaying the audio when the sprite is clicked
    const handleReplayAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Rewind to the beginning
            audioRef.current.play(); // Play the audio
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Pokémon Encountered!</h2>

                <div>
                    {/* Display message for runaway or caught Pokémon */}
                    <h3 className="text-lg">{message}</h3>

                    {caught && pokemon && (
                        <>
                            <p>Level: {pokemon.level}</p>
                            <p>Shiny: {pokemon.is_shiny ? 'Yes' : 'No'}</p>
                            <img
                                src={pokemon.sprite_url}
                                alt={pokemon.name}
                                className="w-32 h-32 object-cover my-4 cursor-pointer"
                                onClick={handleReplayAudio} // Click to replay the audio
                            />
                            <audio ref={audioRef} style={{ display: 'none' }}>
                                <source src={pokemon.cry_url} type="audio/mpeg" />
                            </audio>
                        </>
                    )}

                    {/* Optionally show a different image or message for runaway */}
                    {!caught && (
                        <img
                            src="/images/runaway-sprite.png"  // You can use a generic runaway sprite
                            alt="Runaway"
                            className="w-32 h-32 object-cover my-4"
                        />
                    )}
                </div>

                <button
                    onClick={closeModal}
                    className="mt-4 px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
