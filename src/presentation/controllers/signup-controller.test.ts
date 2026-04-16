import SignupController from '@/presentation/controllers/signup.controller'

describe('SignUp Controller', () => {
    test('Deve retornar 400 se não for informado o nome', () => {
        const sut = new SignupController()
        const request = {
            body: {
                email: 'marquesdanilocarlos@gmail.com',
                password: '123456',
                confirmPassword: '123456'
            }
        }
        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(Error ('Parâmetro "name" não informado'))
    })

    test('Deve retornar 400 se não for informado o email', () => {
        const sut = new SignupController()
        const request = {
            body: {
                name: 'Danilo Marques',
                password: '123456',
                confirmPassword: '123456'
            }
        }
        const httpResponse = sut.handle(request)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(Error ('Parâmetro "email" não informado'))
    })
})