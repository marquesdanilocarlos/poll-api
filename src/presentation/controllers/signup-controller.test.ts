import SignupController from '@/presentation/controllers/signup.controller'
import {MissingParamError, InvalidParamError, ServerError } from '@/presentation/errors'
import EmailValidator from '@/presentation/protocols/email-validator'

type sutType = {
    sut: SignupController
    emailValidatorStub: EmailValidator
}

class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
        return true
    }
}

const makeSut: () => sutType = () => {
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignupController(emailValidatorStub)
    return {sut, emailValidatorStub}
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
        class EmailValidatorStub implements EmailValidator {
            isValid(email: string): boolean {
                throw new Error()
            }
        }

        const emailValidatorStub = new EmailValidatorStub()
        const sut = new SignupController(emailValidatorStub)
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
})