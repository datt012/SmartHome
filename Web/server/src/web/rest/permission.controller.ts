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
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PermissionDTO } from '../../service/dto/permission.dto';
import { PermissionService } from '../../service/permission.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/permissions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('permissions')
export class PermissionController {
    logger = new Logger('PermissionController');

    constructor(private readonly permissionService: PermissionService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PermissionDTO,
    })
    async getAll(@Req() req: Request): Promise<PermissionDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.permissionService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PermissionDTO,
    })
    async getOne(@Param('id') id: string): Promise<PermissionDTO> {
        return await this.permissionService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create permission' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PermissionDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() permissionDTO: PermissionDTO): Promise<PermissionDTO> {
        const created = await this.permissionService.save(permissionDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Permission', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update permission' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PermissionDTO,
    })
    async put(@Req() req: Request, @Body() permissionDTO: PermissionDTO): Promise<PermissionDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Permission', permissionDTO.id);
        return await this.permissionService.update(permissionDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update permission with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PermissionDTO,
    })
    async putId(@Req() req: Request, @Body() permissionDTO: PermissionDTO): Promise<PermissionDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Permission', permissionDTO.id);
        return await this.permissionService.update(permissionDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete permission' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Permission', id);
        return await this.permissionService.deleteById(id);
    }
}
