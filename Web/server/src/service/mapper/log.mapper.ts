import { Log } from '../../domain/log.entity';
import { LogDTO } from '../dto/log.dto';

/**
 * A Log mapper object.
 */
export class LogMapper {
  static fromDTOtoEntity(entityDTO: LogDTO): Log {
    if (!entityDTO) {
      return;
    }
    let entity = new Log();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach((field) => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Log): LogDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new LogDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach((field) => {
      if (field !== '_id') {
        entityDTO[field] = entity[field];
      }
    });

    return entityDTO;
  }
}
