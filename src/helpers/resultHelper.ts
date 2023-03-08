import { NextRequest, NextResponse } from 'next/server'
import { HttpException } from '@/helpers/exceptionHelper'
import { NextApiResponse } from 'next'

export interface IHttpJsonResult<T> {
    data: T | undefined
    total: number
    message: string | undefined
    code: number
    toJson(): string
    toResponse(): NextResponse
    toException(): HttpException
}

export class HttpJsonResult<T = void> implements IHttpJsonResult<T> {
    public static HEADER_PATH = 'request-path'

    public static success<T = void>(
        data: T | undefined = undefined,
        message: string | undefined = undefined
    ): IHttpJsonResult<T> {
        return new HttpJsonResult({
            code: 200,
            total: 0,
            data,
            message,
        } as IHttpJsonResult<T>)
    }

    public static message<T = void>(message: string | undefined = undefined): IHttpJsonResult<T> {
        return new HttpJsonResult({
            code: 200,
            total: 0,
            data: null,
            message,
        } as IHttpJsonResult<T>)
    }
    public static custom<T = void>(
        code: number,
        message: string | undefined,
        data: T | undefined = undefined,
        total: number | undefined = 0
    ): IHttpJsonResult<T> {
        return new HttpJsonResult({
            code,
            data,
            message,
            total: total || 0,
        } as IHttpJsonResult<T>)
    }
    public static fail<T = void>(message: string | undefined): IHttpJsonResult<T> {
        return new HttpJsonResult({
            code: 400,
            total: 0,
            message,
        } as IHttpJsonResult<T>)
    }
    public static notfound<T = void>(message: string | undefined): IHttpJsonResult<T> {
        return new HttpJsonResult({
            code: 404,
            total: 0,
            message,
        } as IHttpJsonResult<T>)
    }
    public static forbidden<T = void>(message: string | undefined = 'forbidden error'): IHttpJsonResult<T> {
        return new HttpJsonResult({
            code: 403,
            total: 0,
            message,
        } as IHttpJsonResult<T>)
    }
    public static unauthorized<T = void>(message: string | undefined = 'authentication required'): IHttpJsonResult<T> {
        return new HttpJsonResult({
            code: 401,
            total: 0,
            message,
        } as IHttpJsonResult<T>)
    }
    public static error<T = void>(message: string | undefined): IHttpJsonResult<T> {
        return new HttpJsonResult({
            code: 500,
            total: 0,
            message,
        } as IHttpJsonResult<T>)
    }

    public static exception<T = void>(error: HttpException | Error | any): IHttpJsonResult<T> {
        if (this.isHttpException(error)) {
            const httpException = error as HttpException
            return new HttpJsonResult({
                code: httpException.status,
                message: httpException.message,
            } as IHttpJsonResult<T>)
        } else {
            return HttpJsonResult.error(error.message || 'Internal Server Error')
        }
    }

    public static next(): NextResponse {
        return NextResponse.next()
    }

    public static isHttpException(err: any): boolean {
        return HttpException.isHttpException(err)
    }
    constructor(model: IHttpJsonResult<T>) {
        this.code = model.code
        this.data = model.data
        this.message = model.message
        this.total = model.total
    }

    public data: T | undefined
    public total!: number
    public message: string | undefined
    public code!: number

    public toJson = () => {
        return JSON.stringify(this)
    }
    public toResponse = () => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }
        return new NextResponse(this.toJson(), {
            status: this.code,
            headers: headers,
        })
    }
    public toException = () => {
        return new HttpException(this.code, this.message ? this.message : 'unknown error')
    }
}
