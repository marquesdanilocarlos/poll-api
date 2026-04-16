import {HttpRequest, HttpResponse} from '@/types/http'
import MissingParamError from '@/presentation/errors/missing-param.error'
import {badRequest} from '@/presentation/helper/http.helper'

export default class SignupController {
    handle(httpRequest: HttpRequest): HttpResponse {

        const requiredFields = ['name', 'email', 'password', 'confirmPassword']

        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }

        return {
            statusCode: 200,
            body: 'ok'
        }
    }
}