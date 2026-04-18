import {HttpRequest, HttpResponse} from '@/types/http'
import {MissingParamError, InvalidParamError} from '@/infra/errors'
import {badRequest, ok, serverError} from '@/infra/helpers/http.helper'
import Controller from '@/infra/controllers/controller'
import EmailValidator from '@/infra/validators/email-validator'
import CreateAccount from '@/application/usecases/create-account'

export default class SignupController implements Controller {
    constructor(private emailValidator: EmailValidator, private createAccount: CreateAccount) {

    }

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'confirmPassword']

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const {name, email, password, confirmPassword} = httpRequest.body

            const validEmail = this.emailValidator.isValid(email)

            if (!validEmail) {
                return badRequest(new InvalidParamError('email'))
            }

            if (password !== confirmPassword) {
                return badRequest(new InvalidParamError('confirmPassword'))
            }

            const account = this.createAccount.execute({name, email, password})

            return ok(account)

        } catch (error) {
            return  serverError()
        }
    }
}