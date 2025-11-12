'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FavoriteWithMovie } from '@/model/favorites'

export function useFavorites() {
    const queryClient = useQueryClient()

    const { data: favorites, isLoading, error } = useQuery({
        queryKey: ['favorites'],
        queryFn: async () => {
            const res = await fetch('/api/movies/favorites')
            if (!res.ok) {
                if (res.status === 401) {
                    return [] // Not authenticated, return empty array
                }
                throw new Error('Failed to fetch favorites')
            }
            const json = await res.json()
            return json.data as FavoriteWithMovie[]
        },
        retry: false
    })

    const addFavoriteMutation = useMutation({
        mutationFn: async (movie_id: number) => {
            const res = await fetch('/api/movies/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movie_id })
            })
            if (!res.ok) throw new Error('Failed to add favorite')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        }
    })

    const removeFavoriteMutation = useMutation({
        mutationFn: async (movie_id: number) => {
            const res = await fetch('/api/movies/favorites', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movie_id })
            })
            if (!res.ok) throw new Error('Failed to remove favorite')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        }
    })

    const isFavorite = (movie_id: number) => {
        return favorites?.some(fav => fav.movie_id === movie_id) ?? false
    }

    const toggleFavorite = (movie_id: number) => {
        if (isFavorite(movie_id)) {
            removeFavoriteMutation.mutate(movie_id)
        } else {
            addFavoriteMutation.mutate(movie_id)
        }
    }

    return {
        favorites: favorites ?? [],
        isLoading,
        error,
        addFavorite: addFavoriteMutation.mutate,
        removeFavorite: removeFavoriteMutation.mutate,
        toggleFavorite,
        isFavorite,
        isAdding: addFavoriteMutation.isPending,
        isRemoving: removeFavoriteMutation.isPending
    }
}
