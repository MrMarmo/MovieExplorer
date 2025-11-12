


import { errorHandlerMW } from '@/middleware/errorHandler.middleware'
import { validateMW } from '@/middleware/validate.middleware'
import { identifyMW } from '@/middleware/identify.middleware'
import { CreateComment, PatchComment, DeleteComment } from '@/model/movie'
import dbPromise from '@/model/db'
import { Comment } from '@/model/temp.interface'
import z from 'zod'
import { NextRequest } from 'next/server'
import { ASSERT } from '@/helpers/general'

const getCommentsSchema = z.object({
    id: z.coerce.number().min(1).max(2147483647)
})

const createCommentSchema = z.object({
    content: z.string().min(1).max(1000),
    rating: z.number().min(1).max(5)
})

const updateCommentSchema = z.object({
    comment_id: z.number().min(1),
    content: z.string().min(1).max(1000),
    rating: z.number().min(1).max(5)
})

const deleteCommentSchema = z.object({
    comment_id: z.number().min(1)
})

// GET - Get all comments for a movie
export const GET = errorHandlerMW(
    [
        validateMW({ params: getCommentsSchema }),
        identifyMW(false)
    ],
    async (req, ctx) => {
        const { id } = ctx.validated.params as z.infer<typeof getCommentsSchema>

        const db = await dbPromise

        const comments = await db.all<Comment[]>(
            `SELECT 
                c.id,
                c.guest_id,
                g.name as guest_name,
                c.movie_id,
                c.content,
                c.rating,
                c.created_at
            FROM comments c
            JOIN guests g ON c.guest_id = g.id
            WHERE c.movie_id = ?
            ORDER BY c.created_at DESC`,
            [id]
        )

        // If user is authenticated, find their comment
        let userComment: Comment | null = null
        if (ctx.guest) {
            userComment = await db.get<Comment>(
                `SELECT 
                    c.id,
                    c.guest_id,
                    g.name as guest_name,
                    c.movie_id,
                    c.content,
                    c.rating,
                    c.created_at
                FROM comments c
                JOIN guests g ON c.guest_id = g.id
                WHERE c.movie_id = ? AND c.guest_id = ?`,
                [id, ctx.guest.id]
            ) || null
        }

        return Response.json({
            data: {
                comments,
                userComment
            }
        }, {
            status: 200
        })
    }
)

// POST - Create a new comment (or update if exist)
export const POST = errorHandlerMW(
    [
        validateMW({ params: getCommentsSchema, body: createCommentSchema }),
        identifyMW(false)
    ],
    async (req, ctx) => {
        const { id } = ctx.validated.params as z.infer<typeof getCommentsSchema>
        const { content, rating } = ctx.validated.body as z.infer<typeof createCommentSchema>

        const guest = ctx.guest!
        const db = await dbPromise

        // Check if user already has a comment on this movie
        const existingComment = await db.get<Comment>(
            'SELECT id FROM comments WHERE movie_id = ? AND guest_id = ?',
            [id, guest.id]
        )

        let fullComment: Comment | undefined

        if (existingComment) {
            await PatchComment(guest.id, existingComment.id, content, rating)
            fullComment = await db.get<Comment>(
                `SELECT 
                    c.id,
                    c.guest_id,
                    g.name as guest_name,
                    c.movie_id,
                    c.content,
                    c.rating,
                    c.created_at
                FROM comments c
                JOIN guests g ON c.guest_id = g.id
                WHERE c.id = ?`,
                [existingComment.id]
            )
        } else {
            const comment = await CreateComment(guest.id, content, id, rating)
            fullComment = await db.get<Comment>(
                `SELECT 
                    c.id,
                    c.guest_id,
                    g.name as guest_name,
                    c.movie_id,
                    c.content,
                    c.rating,
                    c.created_at
                FROM comments c
                JOIN guests g ON c.guest_id = g.id
                WHERE c.id = ?`,
                [comment.id]
            )
        }

        const response = Response.json({
            data: fullComment
        }, {
            status: existingComment ? 200 : 201
        })

        // Set the access token as a cookie
        response.headers.set(
            'Set-Cookie',
            `access_token=${guest.access_token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 365}`
        )

        return response
    }
)

// PATCH - Update a comment
export const PATCH = errorHandlerMW(
    [
        validateMW({ params: getCommentsSchema, body: updateCommentSchema }),
        identifyMW(true)
    ],
    async (req, ctx) => {
        const { id } = ctx.validated.params as z.infer<typeof getCommentsSchema>
        const { comment_id, content, rating } = ctx.validated.body as z.infer<typeof updateCommentSchema>

        const guest = ctx.guest!
        ASSERT(guest !== undefined)

        await PatchComment(guest.id, comment_id, content, rating)

        const db = await dbPromise
        const updatedComment = await db.get<Comment>(
            `SELECT 
                c.id,
                c.guest_id,
                g.name as guest_name,
                c.movie_id,
                c.content,
                c.rating,
                c.created_at
            FROM comments c
            JOIN guests g ON c.guest_id = g.id
            WHERE c.id = ? AND c.movie_id = ?`,
            [comment_id, id]
        )

        return Response.json({
            data: updatedComment
        }, {
            status: 200
        })
    }
)

// DELETE - Delete a comment
export const DELETE = errorHandlerMW(
    [
        validateMW({ params: getCommentsSchema, body: deleteCommentSchema }),
        identifyMW(true)
    ],
    async (req, ctx) => {
        const { comment_id } = ctx.validated.body as z.infer<typeof deleteCommentSchema>

        const guest = ctx.guest!

        await DeleteComment(guest.id, comment_id)

        return Response.json({
            data: { success: true }
        }, {
            status: 200
        })
    }
)