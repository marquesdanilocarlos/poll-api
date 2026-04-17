export default class ServerError extends Error {
    constructor() {
        super('Erro interno do servidor')
        this.name = 'ServerError'
    }
}