/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A LogDTO object.
 */
export class LogDTO extends BaseDTO {
  @ApiModelProperty({ description: 'description field', required: false })
  description: string;

  @ApiModelProperty({ description: 'createdAt field', required: false })
  createdAt: any;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
