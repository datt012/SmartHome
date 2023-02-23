import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { SensorDTO } from '../service/dto/sensor.dto';
import { SensorMapper } from '../service/mapper/sensor.mapper';
import { SensorRepository } from '../repository/sensor.repository';
import { ControllerRepository } from '../repository/controller.repository';

const relationshipNames = [];

@Injectable()
export class SensorService {
  logger = new Logger('SensorService');

  constructor(
    @InjectRepository(SensorRepository) private sensorRepository: SensorRepository,
    @InjectRepository(ControllerRepository) private controllerRepository: ControllerRepository
  ) {
  }

  async findById(id: string): Promise<SensorDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.sensorRepository.findOne(id, options);
    return SensorMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<SensorDTO>): Promise<SensorDTO | undefined> {
    const result = await this.sensorRepository.findOne(options);
    return SensorMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<SensorDTO>, controllerId: string): Promise<[SensorDTO[], number]> {
    options.relations = relationshipNames;
    const controller = await this.controllerRepository.findOne(controllerId);
    if (controller) {
      const sensorIds = controller.sensors.map(s => s.id);
      if (sensorIds.length > 0) {
        const resultList = await this.sensorRepository.findByIds(sensorIds, options);
        const sensorDTOs: SensorDTO[] = [];
        if (resultList) {
          resultList.forEach((sensor) => sensorDTOs.push(SensorMapper.fromEntityToDTO(sensor)));
        }
        return [sensorDTOs, sensorDTOs.length];
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

  async save(sensorDTO: SensorDTO, controllerId: string, creator?: string): Promise<SensorDTO | undefined> {
    const controller = await this.controllerRepository.findOne(controllerId);
    if (controller) {
      const entity = SensorMapper.fromDTOtoEntity(sensorDTO);
      if (creator) {
        if (!entity.createdBy) {
          entity.createdBy = creator;
        }
        entity.lastModifiedBy = creator;
      }
      const result = await this.sensorRepository.save(entity);
      await this.controllerRepository.update(controller.id, { sensors: [...controller.sensors, result] });
      return SensorMapper.fromEntityToDTO(result);
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Controller does not exist'
      }, HttpStatus.NOT_FOUND);
    }

  }

  async update(sensorDTO: SensorDTO, updater?: string): Promise<SensorDTO | undefined> {
    const entity = SensorMapper.fromDTOtoEntity(sensorDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    await this.sensorRepository.update(entity.id, entity);
    return sensorDTO;
  }

  async deleteById(id: string, controllerId: string): Promise<void | undefined> {
    const controller = await this.controllerRepository.findOne(controllerId);
    if (controller) {
      const newSensors = controller.sensors.filter(s => s.id !== id);
      await this.controllerRepository.update(controller.id, { sensors: newSensors });
      await this.sensorRepository.delete(id);
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
