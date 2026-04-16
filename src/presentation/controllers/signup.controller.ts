export default class SignupController {
    handle(httpRequest: any): any {

        if (!httpRequest.body.name) {
            return {
                statusCode: 400,
                    body: new Error('Parâmetro "name" não informado')
            }
        }

        if (!httpRequest.body.email) {
            return {
                statusCode: 400,
                body: new Error('Parâmetro "email" não informado')
            }
        }

        return
    }
}