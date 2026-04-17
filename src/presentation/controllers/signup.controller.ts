import {HttpRequest, HttpResponse} from '@/types/http'
import MissingParamError from '@/presentation/errors/missing-param.error'
import {badRequest} from '@/presentation/helper/http.helper'
import Controller from '@/presentation/controllers/controller'
import EmailValidator from '@/presentation/protocols/email-validator'
import InvalidParamError from '@/presentation/errors/invalid-param.error'
import ServerError from '@/presentation/errors/server.error'

export default class SignupController implements Controller {
    constructor(private emailValidator: EmailValidator) {

    }

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'confirmPassword']

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const validEmail = this.emailValidator.isValid(httpRequest.body.email)

            if (!validEmail) {
                return badRequest(new InvalidParamError('email'))
            }

            return {
                statusCode: 200,
                body: 'ok'
            }

        } catch (error) {
            return  {
                statusCode: 500,
                body: new ServerError()
            }
        }
    }
}