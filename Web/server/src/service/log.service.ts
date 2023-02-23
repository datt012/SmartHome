import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { LogDTO } from '../service/dto/log.dto';
import { LogMapper } from '../service/mapper/log.mapper';
import { LogRepository } from '../repository/log.repository';

const relationshipNames = [];

@Injectable()
export class LogService {
  logger = new Logger('LogService');

  constructor(@InjectRepository(LogRepository) private logRepository: LogRepository) {
  }

  async findById(id: string): Promise<LogDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.logRepository.findOne(id, options);
    return LogMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<LogDTO>): Promise<LogDTO | undefined> {
    const result = await this.logRepository.findOne(options);
    return LogMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<LogDTO>): Promise<[LogDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.logRepository.findAndCount(options);
    const logDTO: LogDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach((log) => logDTO.push(LogMapper.fromEntityToDTO(log)));
      resultList[0] = logDTO;
    }
    return resultList;
  }

  async save(logDTO: LogDTO, creator?: string): Promise<LogDTO | undefined> {
    const entity = LogMapper.fromDTOtoEntity(logDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.logRepository.save(entity);
    return LogMapper.fromEntityToDTO(result);
  }

  async update(logDTO: LogDTO, updater?: string): Promise<LogDTO | undefined> {
    const entity = LogMapper.fromDTOtoEntity(logDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    await this.logRepository.update(entity.id, entity);
    return logDTO;
  }

  async deleteById(id: string): Promise<void | undefined> {
    await this.logRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
