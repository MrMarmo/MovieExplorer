
import { ASSERT } from '@/helpers/general'
import { errorHandlerMW } from '@/middleware/errorHandler.middleware'
import { validateMW } from '@/middleware/validate.middleware'
import z from 'zod'

const THEMOVIEDBKEY = process.env.themoviedb || ''

const searchMovieSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    page: z.coerce.number().min(1).max(1000).optional(),
}).strict()



async function searchMovie(title: string, page: number = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&language=en-US&page=${page}&include_adult=false`

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${THEMOVIEDBKEY}`,
            'Content-Type': 'application/json;charset=utf-8',
        },
    })

    ASSERT(res.ok, `Failed to fetch movies: ${res.status} ${res.statusText}`)

    const data = await res.json()
    return data
}

// GET - Search movies by title
export const GET = errorHandlerMW(
    [
        validateMW({ query: searchMovieSchema })
    ],
    async (req, ctx) => {
        const {
            title,
            page
        } = ctx.validated.query as z.infer<typeof searchMovieSchema>

        const results = await searchMovie(title, page)

        return Response.json({
            data: results,
        }, {
            status: 200,
            headers: {
                'Cache-Control': `s-maxage=${1000 * 60 * 5}` // Cache for 5 minutes
            }
        })
    }
)