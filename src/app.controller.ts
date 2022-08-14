import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
export class AppController {
  @Get()
  @ApiTags('health-check')
  @HttpCode(HttpStatus.OK)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  healthCheck(): Record<string, unknown> {
    return {
      status: 'OK',
    };
  }
}
