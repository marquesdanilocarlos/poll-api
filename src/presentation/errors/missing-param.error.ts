export default class MissingParamError extends Error {
    constructor(paramName: string) {
        super(`Parâmetro "${paramName}" não informado`)
        this.name = 'MissingParamError'
    }
}