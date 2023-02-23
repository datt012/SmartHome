/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';
import { Room } from '../../domain/room.entity';

/**
 * A HomeDTO object.
 */
export class HomeDTO extends BaseDTO {
  @ApiModelProperty({ description: 'name field', required: false })
  name: string;

  @ApiModelProperty({ description: 'location field', required: false })
  location: string;


  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
