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
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LogDTO } from '../../service/dto/log.dto';
import { LogService } from '../../service/log.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/logs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('logs')
export class LogController {
  logger = new Logger('LogController');

  constructor(private readonly logService: LogService) {
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: LogDTO
  })
  async getAll(@Req() req: Request): Promise<LogDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.logService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        createdBy: req.user.login
      }
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: LogDTO
  })
  async getOne(@Param('id') id: string): Promise<LogDTO> {
    return await this.logService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Create log' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: LogDTO
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() logDTO: LogDTO): Promise<LogDTO> {
    const created = await this.logService.save(logDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Log', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Update log' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: LogDTO
  })
  async put(@Req() req: Request, @Body() logDTO: LogDTO): Promise<LogDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Log', logDTO.id);
    return await this.logService.update(logDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Update log with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: LogDTO
  })
  async putId(@Req() req: Request, @Body() logDTO: LogDTO): Promise<LogDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Log', logDTO.id);
    return await this.logService.update(logDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Delete log' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Log', id);
    return await this.logService.deleteById(id);
  }
}
