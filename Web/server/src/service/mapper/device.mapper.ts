import { Device } from '../../domain/device.entity';
import { DeviceDTO } from '../dto/device.dto';

/**
 * A Device mapper object.
 */
export class DeviceMapper {
  static fromDTOtoEntity(entityDTO: DeviceDTO): Device {
    if (!entityDTO) {
      return;
    }
    let entity = new Device();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach((field) => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Device): DeviceDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new DeviceDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach((field) => {
      if (field !== '_id') {
        entityDTO[field] = entity[field];
      }
    });

    return entityDTO;
  }
}
