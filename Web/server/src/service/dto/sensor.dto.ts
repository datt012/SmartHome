/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A SensorDTO object.
 */
export class SensorDTO extends BaseDTO {
  @ApiModelProperty({ description: 'type field', required: false })
  type: string;

  @ApiModelProperty({ description: 'pin field', required: false })
  pin: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
