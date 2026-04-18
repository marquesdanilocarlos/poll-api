import {HttpRequest, HttpResponse} from '@/types/http'
import {MissingParamError, InvalidParamError} from '@/presentation/errors'
import {badRequest, serverError} from '@/presentation/helper/http.helper'
import Controller from '@/presentation/controllers/controller'
import EmailValidator from '@/presentation/protocols/email-validator'

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

            if (httpRequest.body.password !== httpRequest.body.confirmPassword) {
                return badRequest(new InvalidParamError('confirmPassword'))
            }

            return {
                statusCode: 200,
                body: 'ok'
            }

        } catch (error) {
            return  serverError()
        }
    }
}