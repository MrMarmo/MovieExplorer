

import dbPromise from "./db"
import { randomBytes } from 'crypto'

export async function createGuestUser(): Promise<{ id: number, name: string, access_token: string }> {
    const db = await dbPromise

    const access_token = randomBytes(32).toString('hex')

    const name = `Guest_${Date.now()}`

    const result = await db.run(
        'INSERT INTO guests (name, access_token) VALUES (?, ?)',
        [name, access_token]
    )

    return {
        id: result.lastID!,
        name,
        access_token
    }
}