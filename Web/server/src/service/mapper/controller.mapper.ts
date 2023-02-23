import { Controller } from '../../domain/controller.entity';
import { ControllerDTO } from '../dto/controller.dto';

/**
 * A Controller mapper object.
 */
export class ControllerMapper {
  static fromDTOtoEntity(entityDTO: ControllerDTO): Controller {
    if (!entityDTO) {
      return;
    }
    let entity = new Controller();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach((field) => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Controller): ControllerDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ControllerDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach((field) => {
      if (field !== 'devices' && field !== 'sensors' && field !== '_id') {
        entityDTO[field] = entity[field];
      }
    });

    return entityDTO;
  }
}
