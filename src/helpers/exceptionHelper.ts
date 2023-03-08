export class HttpException extends Error {
  public status: number
  public message: string

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.message = message
  }

  public static isHttpException = (err: any) => (err.status ? true : false)
}
