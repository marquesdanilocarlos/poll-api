import SignupController from '@/infra/controllers/signup/signup.controller'
import {MissingParamError, InvalidParamError, ServerError } from '@/infra/errors'
import EmailValidator from '@/infra/validators/email-validator'
import CreateAccount, {CreateAccountInput} from '@/application/usecases/create-account'
import Account from '@/domain/Account'

type sutType = {
    sut: SignupController
    emailValidatorStub: EmailValidator
    createAccountStub: CreateAccount
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeCreateAccount = (): CreateAccount => {
    class CreateAccountStub implements CreateAccount {
        execute (account: CreateAccountInput): Account {
            return {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password'
            }
        }
    }

    return new CreateAccountStub()
}

const makeSut: () => sutType = () => {
    const emailValidatorStub = makeEmailValidator()
    const createAccountStub = makeCreateAccount()
    const sut = new SignupController(emailValidatorStub, createAccountStub)
    return {sut, emailValidatorStub, createAccountStub}
}

describe('SignUp Controller', () => {
    test('Deve retornar 400 se não for informado o nome', () => {
        const {sut, } = makeSut()
        const request = {
            body: {
                email: 'marquesdanilocarlos@gmail.com',
                password: '123456',
                confirmPassword: '123456'
            }
        }
        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Deve retornar 400 se não for informado o email', () => {
        const {sut, } = makeSut()
        const request = {
            body: {
                name: 'Danilo Marques',
                password: '123456',
                confirmPassword: '123456'
            }
        }
        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Deve retornar 400 se não for informado o password', () => {
        const {sut, } = makeSut()
        const request = {
            body: {
                name: 'Danilo Marques',
                email: 'marquesdanilocarlos@gmail.com',
                confirmPassword: '123456'
            }
        }
        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Deve retornar 400 se não for informado o confirmPassword', () => {
        const {sut, } = makeSut()
        const request = {
            body: {
                name: 'Danilo Marques',
                email: 'marquesdanilocarlos@gmail.com',
                password: '123456',
            }
        }
        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
    })

    test('Deve retornar 400 se o email informado for inválido', () => {
        const {sut, emailValidatorStub} = makeSut()
        const request = {
            body: {
                name: 'Danilo Marques',
                email: 'invalid_email@mail.com',
                password: '123456',
                confirmPassword: '123456'
            }
        }
        vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Deve chamar EmailValidator com email correto', () => {
        const {sut, emailValidatorStub} = makeSut()
        const isValidSpy = vitest.spyOn(emailValidatorStub, 'isValid')
        const request = {
            body: {
                name: 'Danilo Marques',
                email: 'email@mail.com',
                password: '123456',
                confirmPassword: '123456'
            }
        }
        sut.handle(request)
        expect(isValidSpy).toHaveBeenCalledWith('email@mail.com')
    })

    test('Deve retornar 500 se o EmailValidator retornar exception', () => {
        const {sut, emailValidatorStub} = makeSut()
        vitest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const request = {
            body: {
                name: 'Danilo Marques',
                email: 'invalid_email@mail.com',
                password: '123456',
                confirmPassword: '123456'
            }
        }

        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Deve retornar 400 se a confirmação do password for diferente', () => {
        const {sut} = makeSut()
        const request = {
            body: {
                name: 'Danilo Marques',
                email: 'invalid_email@mail.com',
                password: '123456',
                confirmPassword: '12345678'
            }
        }

        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('confirmPassword'))
    })

    test('Deve chamar AddAccount com os dados corretos', () => {
        const {sut, createAccountStub} = makeSut()
        const isValidSpy = vitest.spyOn(createAccountStub, 'execute')
        const request = {
            body: {
                name: 'Danilo Marques',
                email: 'invalid_email@mail.com',
                password: '123456',
                confirmPassword: '123456'
            }
        }

        sut.handle(request)
        expect(isValidSpy).toHaveBeenCalledWith({
            name: 'Danilo Marques',
            email: 'invalid_email@mail.com',
            password: '123456',
        })
    })

    test('Deve retornar 500 se o CreateAccount retornar exception', () => {
        const {sut, createAccountStub} = makeSut()
        vitest.spyOn(createAccountStub, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })
        const request = {
            body: {
                name: 'Danilo Marques',
                email: 'invalid_email@mail.com',
                password: '123456',
                confirmPassword: '123456'
            }
        }

        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Deve retornar 200 se dados válidos forem passados', () => {
        const {sut} = makeSut()
        const request = {
            body: {
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password',
                confirmPassword: 'valid_password'
            }
        }

        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        })
    })
})