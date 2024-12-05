import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import EncounterModal from './EncounterModal'; // Import modal component
import axios from 'axios'; // For making API requests

interface Pokemon {
    name: string;
    level: number;
    is_shiny: boolean;
    sprite_url: string;
    cry_url: string;
}

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [encounterDetails, setEncounterDetails] = useState<Pokemon | null>(null);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEncounterClick = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('User is not authenticated');
                return;
            }

            const response = await axios.post<{ caught: boolean, message: string, pokemon?: Pokemon }>('/api/encounter', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setEncounterDetails(response.data); // Assuming response data contains the result of the encounter
            setIsModalOpen(true); // Open the modal with encounter details
        } catch (error) {
            console.error('Error fetching encounter:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <button
                        onClick={handleEncounterClick}
                        className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Encounter a Pokémon
                    </button>

                    {/* Modal for Pokémon encounter */}
                    {isModalOpen && encounterDetails && (
                        <EncounterModal
                            caught={encounterDetails.caught}
                            message={encounterDetails.message}
                            pokemon={encounterDetails.caught ? encounterDetails.pokemon : undefined}
                            closeModal={closeModal}
                        />
                    )}

                    <div className="mt-4">
                        <Link
                            href={route('collection')}
                            className="px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                            Collection
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
