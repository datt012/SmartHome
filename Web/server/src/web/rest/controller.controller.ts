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
import { ControllerDTO } from '../../service/dto/controller.dto';
import { ControllerService } from '../../service/controller.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/controllers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('controllers')
export class ControllerController {
  logger = new Logger('ControllerController');

  constructor(private readonly controllerService: ControllerService) {
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ControllerDTO
  })
  async getAll(@Req() req: Request, @Query('roomId') roomId: string): Promise<ControllerDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.controllerService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        createdBy: req.user.login
      }
    }, roomId);
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ControllerDTO
  })
  async getOne(@Param('id') id: string): Promise<ControllerDTO> {
    return await this.controllerService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create controller' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ControllerDTO
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() controllerDTO: ControllerDTO, @Query('roomId') roomId: string
  ): Promise<ControllerDTO> {
    const created = await this.controllerService.save(controllerDTO, roomId, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Controller', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update controller' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ControllerDTO
  })
  async put(@Req() req: Request, @Body() controllerDTO: ControllerDTO): Promise<ControllerDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Controller', controllerDTO.id);
    return await this.controllerService.update(controllerDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update controller with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ControllerDTO
  })
  async putId(@Req() req: Request, @Body() controllerDTO: ControllerDTO): Promise<ControllerDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Controller', controllerDTO.id);
    return await this.controllerService.update(controllerDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete controller' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async deleteById(@Req() req: Request, @Param('id') id: string, @Query('roomId') roomId: string): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Controller', id);
    return await this.controllerService.deleteById(id, roomId);
  }
}
