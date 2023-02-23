import { Permission } from '../../domain/permission.entity';
import { PermissionDTO } from '../dto/permission.dto';

/**
 * A Permission mapper object.
 */
export class PermissionMapper {
  static fromDTOtoEntity(entityDTO: PermissionDTO): Permission {
    if (!entityDTO) {
      return;
    }
    let entity = new Permission();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach((field) => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Permission): PermissionDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new PermissionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach((field) => {
      if (field !== '_id') {
        entityDTO[field] = entity[field];
      }
    });

    return entityDTO;
  }
}
