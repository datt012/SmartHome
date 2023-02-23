import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from '../web/rest/room.controller';
import { RoomRepository } from '../repository/room.repository';
import { RoomService } from '../service/room.service';
import { HomeRepository } from '../repository/home.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoomRepository, HomeRepository])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule {}
