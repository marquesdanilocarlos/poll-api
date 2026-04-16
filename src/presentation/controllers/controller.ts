import {HttpRequest, HttpResponse} from '@/types/http'

export default interface Controller {
    handle(httpRequest: HttpRequest): HttpResponse
}