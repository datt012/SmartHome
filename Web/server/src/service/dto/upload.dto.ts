import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadDto {
  @ApiModelProperty({ example: 'upload', description: 'Folder to upload', required: true })
  @IsString()
  uploadFolder: string;

}
