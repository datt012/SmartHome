/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { Status } from '../../domain/enumeration/status';

/**
 * A DeviceDTO object.
 */
export class DeviceDTO extends BaseDTO {
  @ApiModelProperty({ enum: Status, description: 'status enum field', required: false })
  status: Status;

  @ApiModelProperty({ description: 'type field', required: false })
  type: string;

  @ApiModelProperty({ description: 'pin field', required: false })
  pin: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
