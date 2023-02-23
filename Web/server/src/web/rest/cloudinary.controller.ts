import { Body, Controller, Logger, Post as PostMethod, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { CloudinaryService } from '../../service/cloudinary.service';
import { UploadDto } from '../../service/dto/upload.dto';

@Controller('api/upload')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('upload')
export class CloudinaryController {
  logger = new Logger('CloudinaryController');

  constructor(private readonly cloudinaryService: CloudinaryService) {
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Upload' })
  @ApiResponse({
    status: 200,
    description: 'Uploaded successfully'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async signUploadForm(@Req() req: Request, @Body() uploadDto: UploadDto): Promise<any> {
    return this.cloudinaryService.signUploadForm(uploadDto);
  }
}
