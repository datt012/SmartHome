/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A PermissionDTO object.
 */
export class PermissionDTO extends BaseDTO {
  @ApiModelProperty({ description: 'permission field', required: false })
  permission: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
