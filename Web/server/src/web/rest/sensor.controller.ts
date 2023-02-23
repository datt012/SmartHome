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
import { SensorDTO } from '../../service/dto/sensor.dto';
import { SensorService } from '../../service/sensor.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/sensors')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('sensors')
export class SensorController {
  logger = new Logger('SensorController');

  constructor(private readonly sensorService: SensorService) {
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: SensorDTO
  })
  async getAll(@Req() req: Request, @Query('controllerId') controllerId: string): Promise<SensorDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.sensorService.findAndCount({
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
    type: SensorDTO
  })
  async getOne(@Param('id') id: string): Promise<SensorDTO> {
    return await this.sensorService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create sensor' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: SensorDTO
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() sensorDTO: SensorDTO, @Query('controllerId') controllerId: string): Promise<SensorDTO> {
    const created = await this.sensorService.save(sensorDTO, controllerId, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Sensor', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update sensor' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SensorDTO
  })
  async put(@Req() req: Request, @Body() sensorDTO: SensorDTO): Promise<SensorDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Sensor', sensorDTO.id);
    return await this.sensorService.update(sensorDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update sensor with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SensorDTO
  })
  async putId(@Req() req: Request, @Body() sensorDTO: SensorDTO): Promise<SensorDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Sensor', sensorDTO.id);
    return await this.sensorService.update(sensorDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete sensor' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async deleteById(@Req() req: Request, @Param('id') id: string, @Query('controllerId') controllerId: string): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Sensor', id);
    return await this.sensorService.deleteById(id, controllerId);
  }
}
