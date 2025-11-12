



import dbPromise from "./db"
import { Comment } from "./temp.interface"

export async function GetCommentsByMovieId(movie_id: number): Promise<Comment[]> {
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
        [movie_id]
    )

    return comments
}

export async function CreateComment(guest_id: number, comment_text: string, movie_id: number, rating: number) {
    const db = await dbPromise

    const result = await db.run(
        'INSERT INTO comments (guest_id, movie_id, content, rating) VALUES (?, ?, ?, ?)',
        [guest_id, movie_id, comment_text, rating]
    )

    return {
        id: result.lastID!,
        guest_id,
        movie_id,
        content: comment_text,
        rating
    }
}

export async function PatchComment(guest_id: number, comment_id: number, comment_text: string, rating: number) {
    const db = await dbPromise

    // Verify the comment belongs to the guest before updating
    const result = await db.run(
        'UPDATE comments SET content = ?, rating = ? WHERE id = ? AND guest_id = ?',
        [comment_text, rating, comment_id, guest_id]
    )

    if (result.changes === 0) {
        throw new Error('Comment not found or unauthorized')
    }

    return {
        id: comment_id,
        guest_id,
        content: comment_text,
        rating
    }
}

export async function DeleteComment(guest_id: number, comment_id: number) {
    const db = await dbPromise

    // Verify the comment belongs to the guest before deleting
    const result = await db.run(
        'DELETE FROM comments WHERE id = ? AND guest_id = ?',
        [comment_id, guest_id]
    )

    if (result.changes === 0) {
        throw new Error('Comment not found or unauthorized')
    }

    return { success: true }
}
