import { RouteHandler, MiddlewareFunction, RouteContext } from './makeMiddleWareHelper'
import { NextRequest } from 'next/server'


export function errorHandlerMW(
    middlewares: MiddlewareFunction[],
    handler: RouteHandler
): (req: NextRequest, routeCtx?: { params: Promise<any> }) => Promise<Response> {
    return async (req: NextRequest, routeCtx?: { params: Promise<any> }) => {
        const ctx: RouteContext = {
            params: routeCtx?.params || Promise.resolve({})
        }

        try {
            for (const middleware of middlewares) {
                const result = await middleware(req, ctx)

                if (result instanceof Response) {
                    return result
                }
            }

            return await handler(req, ctx)
        } catch (error) {
            // Temp console log
            console.log('Error caught in errorHandlerMW:', error)

            // Handle errors throws
            if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                const errorCode = (error as any).code || 500
                const errorMessage = (error as any).message || 'Internal Server Error'

                // For 500 errors, return generic message for security
                if (errorCode >= 500) {
                    return Response.json(
                        { error: 'Internal Server Error' },
                        { status: errorCode }
                    )
                }

                // For 400 errors, return the actual message
                return Response.json(
                    { error: errorMessage },
                    { status: errorCode }
                )
            }

            // Standard Error objects
            if (error instanceof Error) {
                return Response.json(
                    { error: 'Internal Server Error' },
                    { status: 500 }
                )
            }

            // Unknown error
            return Response.json(
                { error: 'Internal Server Error' },
                { status: 500 }
            )
        }
    }
}
