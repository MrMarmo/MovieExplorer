
import { ASSERT } from '@/helpers/general'
import { errorHandlerMW } from '@/middleware/errorHandler.middleware'
import { validateMW } from '@/middleware/validate.middleware'
import z from 'zod'

const THEMOVIEDBKEY = process.env.themoviedb || ''

const getMovieDetailSchema = z.object({
    id: z.coerce.number().min(1).max(2147483647)
})


async function getMovieDetail(id: number) {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`

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

export const GET = errorHandlerMW(
    [
        validateMW({ params: getMovieDetailSchema })
    ],
    async (req, ctx) => {
        const {
            id
        } = ctx.validated.params as z.infer<typeof getMovieDetailSchema>

        const results = await getMovieDetail(id)

        return Response.json({
            data: results,
        }, {
            status: 200,
            headers: {
                'Cache-Control': `s-maxage=${1000 * 60 * 60}`
            }
        })
    }
)