import { Body, Controller, Logger, Post as PostMethod, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { pusher } from '../../pusher';
import { PusherDTO } from '../../service/dto/pusher.dto';

@Controller('api/pusher')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('pusher')
export class RealtimeController {
  logger = new Logger('RealtimeController');

  @PostMethod('/auth')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Pusher authenticate' })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() pusherDTO: PusherDTO): Promise<any> {
    const socketId = pusherDTO.socket_id;
    const channel = pusherDTO.channel_name;
    const auth = pusher.authenticate(socketId, channel);

    return auth;
  }
}
