import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : 500;

        const errorResponse = {
            status: 'error',
            data: null,
            message: (exception instanceof HttpException) ? exception.getResponse() : 'Internal server error',
            error: exception instanceof HttpException ? exception.message : 'Internal server error',
        };

        response.status(status).json(errorResponse);
    }
}
