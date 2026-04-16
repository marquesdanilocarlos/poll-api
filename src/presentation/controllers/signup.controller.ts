import {HttpRequest, HttpResponse} from '@/types/http'

export default class SignupController {
    handle(httpRequest: HttpRequest): HttpResponse {

        if (!httpRequest.body.name) {
            return {
                statusCode: 400,
                body: new Error('Parâmetro "name" não informado')
            }
        }

        if (!httpRequest.body.email) {
            return {
                statusCode: 400,
                body: new Error('Parâmetro "email" não informado')
            }
        }

        return {
            statusCode: 200,
            body: 'ok'
        }
    }
}