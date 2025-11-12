'use client'

import { useFavorites } from "@/hooks/useFavorites"
import { MovieCard } from "@/components/Movies/MovieCard"
import Link from "next/link"

export default function FavoritesList() {
    const { 
        favorites, isLoading, removeFavorite, isRemoving 
    } = useFavorites()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="h-10 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 mb-2" />
                        <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-2/3 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center px-4">
                    <svg className="mx-auto h-24 w-24 text-zinc-400 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                        No Favorites Yet
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Start adding movies to your favorites list
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold hover:opacity-80 transition-opacity"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search Movies
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        My Favorites
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
                    </p>
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className="relative group">
                            <MovieCard movie={favorite.movie} />
                            
                            {/* Remove Button Overlay */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (confirm('Remove this movie from favorites?')) {
                                        removeFavorite(favorite.movie_id)
                                    }
                                }}
                                disabled={isRemoving}
                                className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                                title="Remove from favorites"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
