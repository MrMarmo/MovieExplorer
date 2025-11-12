import { NextRequest, NextResponse } from 'next/server'

// Add to next.js context type
export type RouteContext = {
    params: Promise<any>
    [key: string]: any
}

export type MiddlewareFunction = (
    req: NextRequest,
    ctx: RouteContext
) => Promise<Response | void> | Response | void

export type RouteHandler = (
    req: NextRequest,
    ctx: RouteContext
) => Promise<Response> | Response


export function makeMiddleware(
    middlewares: MiddlewareFunction[],
    handler: RouteHandler
) {
    return async (req: NextRequest, routeCtx?: { params: Promise<any> }) => {
        const ctx: RouteContext = {
            params: routeCtx?.params || Promise.resolve({})
        }

        // Execute each middleware in sequence
        for (const middleware of middlewares) {
            try {
                const result = await middleware(req, ctx)

                // If middleware returns a Response, short-circuit and return it
                if (result instanceof Response) {
                    return result
                }
            } catch (error) {
                // If middleware throws an error, convert to error response
                if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                    return Response.json(
                        { error: (error as any).message },
                        { status: (error as any).code || 500 }
                    )
                }

                // Shoudln't reach here.
                return Response.json(
                    { error: error instanceof Error ? error.message : 'Internal Server Error' },
                    { status: 500 }
                )
            }
        }

        // Execute the final route handler with the enriched context
        try {
            return await handler(req, ctx)
        } catch (error) {
            // Handle errors from the route handler
            if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                return Response.json(
                    { error: (error as any).message },
                    { status: (error as any).code || 500 }
                )
            }

            return Response.json(
                { error: error instanceof Error ? error.message : 'Internal Server Error' },
                { status: 500 }
            )
        }
    }
}
