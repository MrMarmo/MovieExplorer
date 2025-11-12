



export function ASSERT(condition: any, message: string = "Internal Error", code: number = 500): asserts condition {
    if (!condition) {
        throw { message, code }
    }
}