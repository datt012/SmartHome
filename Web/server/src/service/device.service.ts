import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { DeviceDTO } from '../service/dto/device.dto';
import { DeviceMapper } from '../service/mapper/device.mapper';
import { DeviceRepository } from '../repository/device.repository';
import { ControllerRepository } from '../repository/controller.repository';

const relationshipNames = [];

@Injectable()
export class DeviceService {
  logger = new Logger('DeviceService');

  constructor(
    @InjectRepository(DeviceRepository) private deviceRepository: DeviceRepository,
    @InjectRepository(ControllerRepository) private controllerRepository: ControllerRepository
  ) {
  }

  async findById(id: string): Promise<DeviceDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.deviceRepository.findOne(id, options);

    return DeviceMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<DeviceDTO>): Promise<DeviceDTO | undefined> {
    const result = await this.deviceRepository.findOne(options);
    return DeviceMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<DeviceDTO>, controllerId: string): Promise<[DeviceDTO[], number]> {
    options.relations = relationshipNames;
    const controller = await this.controllerRepository.findOne(controllerId);
    if (controller) {
      const deviceIds = controller.devices.map(d => d.id);
      if (deviceIds.length > 0) {
        const resultList = await this.deviceRepository.findByIds(deviceIds, options);
        const deviceDTOs: DeviceDTO[] = [];
        if (resultList) {
          resultList.forEach((device) => deviceDTOs.push(DeviceMapper.fromEntityToDTO(device)));
        }
        return [deviceDTOs, deviceDTOs.length];
      } else {
        return [[], 0];
      }
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Controller does not exist'
      }, HttpStatus.NOT_FOUND);
    }
  }

  async save(deviceDTO: DeviceDTO, controllerId: string, creator?: string): Promise<DeviceDTO | undefined> {
    const controller = await this.controllerRepository.findOne(controllerId);
    if (controller) {
      const entity = DeviceMapper.fromDTOtoEntity(deviceDTO);
      if (creator) {
        if (!entity.createdBy) {
          entity.createdBy = creator;
        }
        entity.lastModifiedBy = creator;
      }
      const result = await this.deviceRepository.save(entity);
      await this.controllerRepository.update(controller.id, { devices: [...controller.devices, result] });
      return DeviceMapper.fromEntityToDTO(result);
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Controller does not exist'
      }, HttpStatus.NOT_FOUND);
    }
  }

  async update(deviceDTO: DeviceDTO, updater?: string): Promise<DeviceDTO | undefined> {
    const entity = DeviceMapper.fromDTOtoEntity(deviceDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    await this.deviceRepository.update(entity.id, entity);
    return deviceDTO;
  }

  async deleteById(id: string, controllerId: string): Promise<void | undefined> {
    const controller = await this.controllerRepository.findOne(controllerId);
    if (controller) {
      const newDevices = controller.devices.filter(d => d.id !== id);
      await this.controllerRepository.update(controller.id, { devices: newDevices });
      await this.deviceRepository.delete(id);
      const entityFind = await this.findById(id);
      if (entityFind) {
        throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
      }
      return;
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Controller does not exist'
      }, HttpStatus.NOT_FOUND);
    }
  }
}
