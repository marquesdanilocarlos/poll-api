export class InvalidParamError extends Error {
    constructor(paramName: string) {
        super(`Parâmetro "${paramName}" é inválido`)
        this.name = 'InvalidParamError'
    }
}