import dbPromise from "./db"
import { Movie } from "./temp.interface"

interface Favorite {
    id: number
    guest_id: number
    movie_id: number
    movie_data: string
    created_at: string
}

export interface FavoriteWithMovie extends Omit<Favorite, 'movie_data'> {
    movie: Movie
}

export async function AddFavorite(guest_id: number, movie_id: number, movieData: Movie): Promise<Favorite> {
    const db = await dbPromise

    const result = await db.run(
        'INSERT INTO favorites (guest_id, movie_id, movie_data) VALUES (?, ?, ?)',
        [guest_id, movie_id, JSON.stringify(movieData)]
    )

    return {
        id: result.lastID!,
        guest_id,
        movie_id,
        movie_data: JSON.stringify(movieData),
        created_at: new Date().toISOString()
    }
}

export async function GetFavorites(guest_id: number): Promise<FavoriteWithMovie[]> {
    const db = await dbPromise

    const favorites = await db.all<Favorite[]>(
        'SELECT id, guest_id, movie_id, movie_data, created_at FROM favorites WHERE guest_id = ? ORDER BY created_at DESC',
        [guest_id]
    )

    return favorites.map(fav => ({
        id: fav.id,
        guest_id: fav.guest_id,
        movie_id: fav.movie_id,
        created_at: fav.created_at,
        movie: JSON.parse(fav.movie_data) as Movie
    }))
}

export async function DeleteFavorite(guest_id: number, movie_id: number): Promise<boolean> {
    const db = await dbPromise

    const result = await db.run(
        'DELETE FROM favorites WHERE guest_id = ? AND movie_id = ?',
        [guest_id, movie_id]
    )

    if (result.changes === 0) {
        throw new Error('Favorite not found or unauthorized')
    }

    return true
}

export async function IsFavorite(guest_id: number, movie_id: number): Promise<boolean> {
    const db = await dbPromise

    const favorite = await db.get(
        'SELECT id FROM favorites WHERE guest_id = ? AND movie_id = ?',
        [guest_id, movie_id]
    )

    return !!favorite
}

