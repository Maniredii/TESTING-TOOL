export class ResponseBuilder {
  static success<T>(data: T, message: string = 'Success', statusCode: number = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error(message: string = 'Error', statusCode: number = 500, errors: any = null) {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }
}
