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
import { HomeDTO } from '../../service/dto/home.dto';
import { HomeService } from '../../service/home.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/homes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('homes')
export class HomeController {
  logger = new Logger('HomeController');

  constructor(private readonly homeService: HomeService) {
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: HomeDTO
  })
  async getAll(@Req() req: Request): Promise<HomeDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.homeService.findAndCount({
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
    type: HomeDTO
  })
  async getOne(@Param('id') id: string): Promise<HomeDTO> {
    return await this.homeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create home' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: HomeDTO
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() homeDTO: HomeDTO): Promise<HomeDTO> {
    const created = await this.homeService.save(homeDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Home', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update home' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: HomeDTO
  })
  async put(@Req() req: Request, @Body() homeDTO: HomeDTO): Promise<HomeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Home', homeDTO.id);
    return await this.homeService.update(homeDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update home with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: HomeDTO
  })
  async putId(@Req() req: Request, @Body() homeDTO: HomeDTO): Promise<HomeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Home', homeDTO.id);
    return await this.homeService.update(homeDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete home' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Home', id);
    return await this.homeService.deleteById(id);
  }
}
