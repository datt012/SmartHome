import { Sensor } from '../../domain/sensor.entity';
import { SensorDTO } from '../dto/sensor.dto';

/**
 * A Sensor mapper object.
 */
export class SensorMapper {
  static fromDTOtoEntity(entityDTO: SensorDTO): Sensor {
    if (!entityDTO) {
      return;
    }
    let entity = new Sensor();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach((field) => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Sensor): SensorDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new SensorDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach((field) => {
      if (field !== '_id') {
        entityDTO[field] = entity[field];
      }
    });

    return entityDTO;
  }
}
