/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A ControllerDTO object.
 */
export class ControllerDTO extends BaseDTO {
  @ApiModelProperty({ description: 'uuid field', required: false })
  uuid: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
