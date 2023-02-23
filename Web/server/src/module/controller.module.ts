import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllerController } from '../web/rest/controller.controller';
import { ControllerRepository } from '../repository/controller.repository';
import { ControllerService } from '../service/controller.service';
import { HomeRepository } from '../repository/home.repository';
import { RoomRepository } from '../repository/room.repository';
import { RoomService } from '../service/room.service';
import { HomeService } from '../service/home.service';

@Module({
  imports: [TypeOrmModule.forFeature([ControllerRepository, HomeRepository, RoomRepository])],
  controllers: [ControllerController],
  providers: [ControllerService, RoomService, HomeService],
  exports: [ControllerService]
})
export class ControllerModule {}
