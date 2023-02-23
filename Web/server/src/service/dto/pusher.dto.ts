import { ApiModelProperty } from '@nestjs/swagger';

export class PusherDTO {
  @ApiModelProperty({ description: 'socket id', required: false })
  socket_id: string;

  @ApiModelProperty({ description: 'channel name', required: false })
  channel_name: string;
}
