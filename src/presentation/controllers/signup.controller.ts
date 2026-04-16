import {HttpRequest, HttpResponse} from '@/types/http'
import MissingParamError from '@/presentation/errors/missing-param.error'

export default class SignupController {
    handle(httpRequest: HttpRequest): HttpResponse {

        if (!httpRequest.body.name) {
            return {
                statusCode: 400,
                body: new MissingParamError('Parâmetro "name" não informado')
            }
        }

        if (!httpRequest.body.email) {
            return {
                statusCode: 400,
                body: new MissingParamError('Parâmetro "email" não informado')
            }
        }

        return {
            statusCode: 200,
            body: 'ok'
        }
    }
}