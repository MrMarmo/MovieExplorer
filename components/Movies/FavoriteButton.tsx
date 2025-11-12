'use client'

import { useFavorites } from "@/hooks/useFavorites"

interface FavoriteButtonProps {
    movieId: number
}

export default function FavoriteButton({ movieId }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite, isAdding, isRemoving } = useFavorites()
    
    const favorited = isFavorite(movieId)
    const isLoading = isAdding || isRemoving

    return (
        <button
            onClick={() => toggleFavorite(movieId)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-600 bg-white dark:bg-zinc-900 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <svg 
                className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`}
                fill={favorited ? 'currentColor' : 'none'}
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
            </svg>
            {isLoading 
                ? 'Loading...' 
                : favorited 
                    ? 'Remove from Favorites' 
                    : 'Add to Favorites'}
        </button>
    )
}
