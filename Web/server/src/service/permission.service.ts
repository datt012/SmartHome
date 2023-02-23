import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PermissionDTO } from '../service/dto/permission.dto';
import { PermissionMapper } from '../service/mapper/permission.mapper';
import { PermissionRepository } from '../repository/permission.repository';

const relationshipNames = [];

@Injectable()
export class PermissionService {
  logger = new Logger('PermissionService');

  constructor(@InjectRepository(PermissionRepository) private permissionRepository: PermissionRepository) {
  }

  async findById(id: string): Promise<PermissionDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.permissionRepository.findOne(id, options);
    return PermissionMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<PermissionDTO>): Promise<PermissionDTO | undefined> {
    const result = await this.permissionRepository.findOne(options);
    return PermissionMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<PermissionDTO>): Promise<[PermissionDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.permissionRepository.findAndCount(options);
    const permissionDTO: PermissionDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach((permission) => permissionDTO.push(PermissionMapper.fromEntityToDTO(permission)));
      resultList[0] = permissionDTO;
    }
    return resultList;
  }

  async save(permissionDTO: PermissionDTO, creator?: string): Promise<PermissionDTO | undefined> {
    const entity = PermissionMapper.fromDTOtoEntity(permissionDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.permissionRepository.save(entity);
    return PermissionMapper.fromEntityToDTO(result);
  }

  async update(permissionDTO: PermissionDTO, updater?: string): Promise<PermissionDTO | undefined> {
    const entity = PermissionMapper.fromDTOtoEntity(permissionDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    await this.permissionRepository.update(entity.id, entity);
    return permissionDTO;
  }

  async deleteById(id: string): Promise<void | undefined> {
    await this.permissionRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
