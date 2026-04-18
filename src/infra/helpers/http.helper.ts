import {HttpResponse} from '@/types/http'
import {ServerError} from '@/infra/errors'

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error
})

export const serverError = (): HttpResponse => ({
    statusCode: 500,
    body: new ServerError()
})