import { ServiceUnavailableException } from '@nestjs/common';

export class AiServiceException extends ServiceUnavailableException {
  constructor(reason?: string) {
    super({
      code: 'AI_SERVICE_ERROR',
      message: reason ?? 'AI service is currently unavailable',
    });
  }
}