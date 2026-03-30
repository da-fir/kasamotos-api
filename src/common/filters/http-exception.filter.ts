import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let code = 'INTERNAL_SERVER_ERROR';
      let message = 'An unexpected error occurred';
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
  
        if (typeof exceptionResponse === 'object') {
          const resp = exceptionResponse as any;
          code = resp.code ?? 'HTTP_ERROR';
          message = resp.message ?? exception.message;
        } else {
          message = exceptionResponse;
        }
      }
  
      this.logger.error(
        `${request.method} ${request.url} → ${status} ${message}`,
      );
  
      response.status(status).json({
        success: false,
        error: {
          code,
          message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }