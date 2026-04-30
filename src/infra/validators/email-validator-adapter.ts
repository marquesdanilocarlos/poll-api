import EmailValidator from '@/infra/validators/email-validator'

export default class EmailValidatorAdapter implements EmailValidator {
    isValid(email: string): boolean {
        return false
    }
}