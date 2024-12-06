import React from 'react';

interface PokemonCardProps {
    level: number
    pokemon: {
        name: string;
        level: number;
        sprite_url: string;
        type: string;
        type2: string;
    };
}

const getTypeBackgroundColor = (type: string, type2?: string) => {
    const typeColors: { [key: string]: string } = {
        water: 'from-blue-600 to-blue-400',
        fire: 'from-red-600 to-red-400',
        grass: 'from-green-600 to-green-400',
        bug: 'from-lime-500 to-lime-300',
        flying: 'from-sky-500 to-sky-300',
        normal: 'from-white to-gray-100',
        fairy: 'from-pink-500 to-pink-300',
        psychic: 'from-pink-700 to-pink-500',
        electric: 'from-yellow-500 to-yellow-200',
        fighting: 'from-orange-600 to-orange-400',
        dark: 'from-neutral-800 to-neutral-600',
        ghost: 'from-indigo-900 to-indigo-700',
        steel: 'from-gray-300 to-gray-100',
        dragon: 'from-violet-800 to-violet-600',
        ground: 'from-orange-400 to-orange-200',
        poison: 'from-purple-700 to-purple-500',
        rock: 'from-stone-500 to-stone-300',
        ice: 'from-cyan-500 to-cyan-300',
    };

    let primaryTypeGradient = typeColors[type] || 'from-gray-700 to-gray-600';

    if (!type2) {
        return `bg-gradient-to-r ${primaryTypeGradient}`;
    }

    const secondaryTypeGradient = typeColors[type2] || 'from-gray-700 to-gray-600';

    const [primaryFrom, primaryTo] = primaryTypeGradient.split(' ');
    const [secondaryFrom, secondaryTo] = secondaryTypeGradient.split(' ');

    return `bg-gradient-to-r ${primaryFrom} ${secondaryTo}`;
};

const PokemonCard: React.FC<PokemonCardProps> = ({ level, pokemon }) => {
    const { name, sprite_url, type, type2 } = pokemon;
    const typeBgColor = getTypeBackgroundColor(type, type2);

    return (
        <div
            className={`cursor-pointer p-4 border-none rounded-lg shadow-lg ${typeBgColor} relative`}
        >
            <div className="absolute top-3 right-3 text-gray-600 font-bold text-2xl"><span className="text-lg">Lvl </span>{level}</div>
            <h3 className="text-lg font-bold">{name}</h3>
            <div className="flex justify-center mt-4">
                <img
                    src={sprite_url}
                    alt={name}
                    className="w-44 h-32 object-cover"
                />
            </div>
        </div>
    );
};

export default PokemonCard;
