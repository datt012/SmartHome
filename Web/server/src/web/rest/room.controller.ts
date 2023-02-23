import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors, Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RoomDTO } from '../../service/dto/room.dto';
import { RoomService } from '../../service/room.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/rooms')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('rooms')
export class RoomController {
  logger = new Logger('RoomController');

  constructor(private readonly roomService: RoomService) {
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: RoomDTO
  })
  async getAll(@Req() req: Request, @Query('homeId') homeId: string): Promise<RoomDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.roomService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        createdBy: req.user.login
      }
    }, homeId);
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RoomDTO
  })
  async getOne(@Param('id') id: string): Promise<RoomDTO> {
    return await this.roomService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create room' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: RoomDTO
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() roomDTO: RoomDTO, @Query('homeId') homeId: string): Promise<RoomDTO> {
    const created = await this.roomService.save(roomDTO, homeId, req.user?.login);
    if (created) {
      HeaderUtil.addEntityCreatedHeaders(req.res, 'Room', created.id);
    }
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update room' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RoomDTO
  })
  async put(@Req() req: Request, @Body() roomDTO: RoomDTO): Promise<RoomDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Room', roomDTO.id);
    return await this.roomService.update(roomDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update room with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RoomDTO
  })
  async putId(@Req() req: Request, @Body() roomDTO: RoomDTO): Promise<RoomDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Room', roomDTO.id);
    return await this.roomService.update(roomDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete room' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async deleteById(@Req() req: Request, @Param('id') id: string, @Query('homeId') homeId: string): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Room', id);
    return await this.roomService.deleteById(homeId, id);
  }
}
