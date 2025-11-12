import { errorHandlerMW } from '@/middleware/errorHandler.middleware'
import { validateMW } from '@/middleware/validate.middleware'
import { identifyMW } from '@/middleware/identify.middleware'
import { AddFavorite, GetFavorites, DeleteFavorite } from '@/model/favorites'
import { Movie } from '@/model/temp.interface'
import z from 'zod'
import { ASSERT } from '@/helpers/general'

const THEMOVIEDBKEY = process.env.themoviedb || ''

const addFavoriteSchema = z.object({
    movie_id: z.number().min(1).max(2147483647)
})

const deleteFavoriteSchema = z.object({
    movie_id: z.number().min(1).max(2147483647)
})

async function fetchMovieFromTMDb(movie_id: number): Promise<Movie> {
    const url = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${THEMOVIEDBKEY}`,
            'Content-Type': 'application/json;charset=utf-8',
        },
    })

    ASSERT(res.ok, `Failed to fetch movie: ${res.status} ${res.statusText}`)

    return await res.json()
}

// GET - Get all favorites for the user
export const GET = errorHandlerMW(
    [
        identifyMW(true)
    ],
    async (req, ctx) => {
        const guest = ctx.guest!

        const favorites = await GetFavorites(guest.id)

        return Response.json({
            data: favorites
        }, {
            status: 200
        })
    }
)

// POST - Add a movie to favorites
export const POST = errorHandlerMW(
    [
        validateMW({ body: addFavoriteSchema }),
        identifyMW(false) // Auto-create guest if not authenticated
    ],
    async (req, ctx) => {
        const { movie_id } = ctx.validated.body as z.infer<typeof addFavoriteSchema>
        const guest = ctx.guest!

        // Fetch movie data from TMDb
        const movieData = await fetchMovieFromTMDb(movie_id)

        // Add to favorites
        const favorite = await AddFavorite(guest.id, movie_id, movieData)

        const response = Response.json({
            data: {
                id: favorite.id,
                guest_id: favorite.guest_id,
                movie_id: favorite.movie_id,
                created_at: favorite.created_at,
                movie: movieData
            }
        }, {
            status: 201
        })

        response.headers.set(
            'Set-Cookie',
            `access_token=${guest.access_token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 365}`
        )

        return response
    }
)

// DELETE - Remove a movie from favorites
export const DELETE = errorHandlerMW(
    [
        validateMW({ body: deleteFavoriteSchema }),
        identifyMW(true)
    ],
    async (req, ctx) => {
        const { movie_id } = ctx.validated.body as z.infer<typeof deleteFavoriteSchema>
        const guest = ctx.guest!

        await DeleteFavorite(guest.id, movie_id)

        return Response.json({
            data: { success: true }
        }, {
            status: 200
        })
    }
)
