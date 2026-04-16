import {HttpResponse} from '@/types/http'

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error
})