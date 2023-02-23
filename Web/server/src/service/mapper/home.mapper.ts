import { Home } from '../../domain/home.entity';
import { HomeDTO } from '../dto/home.dto';

/**
 * A HomePage mapper object.
 */
export class HomeMapper {
  static fromDTOtoEntity(entityDTO: HomeDTO): Home {
    if (!entityDTO) {
      return;
    }
    let entity = new Home();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach((field) => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Home): HomeDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new HomeDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach((field) => {
      if (field !== 'rooms' && field !== '_id') {
        entityDTO[field] = entity[field];
      }
    });

    return entityDTO;
  }
}
