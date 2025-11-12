import { ASSERT } from '@/helpers/general'
import { MiddlewareFunction } from './makeMiddleWareHelper'
import z, { ZodSchema } from 'zod'
import { NextRequest } from 'next/server'

interface ValidateOptions {
    query?: ZodSchema
    body?: ZodSchema
    params?: ZodSchema
}

const strictBlankSchema = z.object({}).strict()

/** Convert Zod validation errors into humanish readable messages */
export const messageValidator = (error: z.ZodError<any> | undefined) => {
    if (!error) return 'Unknown validation error'

    const errors = error.issues.map(issue => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'input'

        if (issue.code === 'invalid_type') {
            const invalidTypeIssue = issue as any
            if (invalidTypeIssue.received === 'undefined') {
                return `Missing required field: '${path}'`
            }
            return `Invalid type for '${path}': expected ${invalidTypeIssue.expected}, received ${invalidTypeIssue.received}`
        }

        return `${path}: ${issue.message}`
    })

    return errors.join('; ')
}

export const validateMW = (options: ValidateOptions): MiddlewareFunction => {
    return async (req: NextRequest, ctx) => {
        ctx.validated = {}


        // Validate query parameters
        const querySchema = options.query || strictBlankSchema
        const { searchParams } = new URL(req.url)
        const queryResult = querySchema.safeParse(
            Object.fromEntries(searchParams.entries())
        )
        ASSERT(queryResult.success, messageValidator(queryResult.error), 400)
        ctx.validated.query = queryResult.data

        // Validate request body (not tested)
        const bodySchema = options.body || strictBlankSchema
        let bodyData: any = {}
        try {
            const text = await req.text()
            if (text) {
                bodyData = JSON.parse(text)
            }
        } catch (e) {
            ASSERT(false, 'Invalid JSON in request body', 400)
        }
        const bodyResult = bodySchema.safeParse(bodyData)
        ASSERT(bodyResult.success, messageValidator(bodyResult.error), 400)
        ctx.validated.body = bodyResult.data

        // Validate route parameters
        const paramsSchema = options.params || strictBlankSchema
        const paramsData = await ctx.params
        const paramsResult = paramsSchema.safeParse(paramsData)
        ASSERT(paramsResult.success, messageValidator(paramsResult.error), 400)
        ctx.validated.params = paramsResult.data

        return
    }
}
