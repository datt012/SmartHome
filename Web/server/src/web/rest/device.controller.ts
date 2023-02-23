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
import { DeviceDTO } from '../../service/dto/device.dto';
import { DeviceService } from '../../service/device.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/devices')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('devices')
export class DeviceController {
  logger = new Logger('DeviceController');

  constructor(private readonly deviceService: DeviceService) {
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: DeviceDTO
  })
  async getAll(@Req() req: Request, @Query('controllerId') controllerId: string): Promise<DeviceDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.deviceService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        createdBy: req.user.login
      }
    }, controllerId);
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: DeviceDTO
  })
  async getOne(@Param('id') id: string): Promise<DeviceDTO> {
    return await this.deviceService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create device' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: DeviceDTO
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() deviceDTO: DeviceDTO, @Query('controllerId') controllerId: string): Promise<DeviceDTO> {
    const created = await this.deviceService.save(deviceDTO, controllerId, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Device', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update device' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DeviceDTO
  })
  async put(@Req() req: Request, @Body() deviceDTO: DeviceDTO): Promise<DeviceDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Device', deviceDTO.id);
    return await this.deviceService.update(deviceDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update device with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DeviceDTO
  })
  async putId(@Req() req: Request, @Body() deviceDTO: DeviceDTO): Promise<DeviceDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Device', deviceDTO.id);
    return await this.deviceService.update(deviceDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete device' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async deleteById(@Req() req: Request, @Param('id') id: string, @Query('controllerId') controllerId: string): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Device', id);
    return await this.deviceService.deleteById(id, controllerId);
  }
}
