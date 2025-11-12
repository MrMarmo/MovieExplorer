import { NextRequest } from 'next/server'
import { RouteContext } from './makeMiddleWareHelper'
import dbPromise from '@/model/db'
import { createGuestUser } from '@/model/guest'

export interface GuestUser {
    id: number
    name: string
    access_token: string
}

export function identifyMW(required: boolean = false) {
    return async (req: NextRequest, ctx: RouteContext & { guest?: GuestUser }) => {
        const db = await dbPromise
        let token = req.cookies.get('access_token')?.value

        if (!token) {
            const authHeader = req.headers.get('Authorization')
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.substring(7)
            }
        }

        if (token) {
            const guest = await db.get<GuestUser>(
                'SELECT id, name, access_token FROM guests WHERE access_token = ?',
                [token]
            )

            if (guest) {
                ctx.guest = guest
                return
            }
        }

        // If required and no valid token, return error
        if (required) {
            return Response.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        // If not required, create a new guest user
        const newGuest = await createGuestUser()
        ctx.guest = newGuest
    }
}
