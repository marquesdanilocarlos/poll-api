import EmailValidatorAdapter from '@/infra/validators/email-validator-adapter'

describe('EmailValidatorAdapter', () => {
    test('Deve retornar false se o validator retornar false', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalid_email@mail.com')

        expect(isValid).toBe(false)
    })
})