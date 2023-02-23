import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeController } from '../web/rest/home.controller';
import { HomeRepository } from '../repository/home.repository';
import { HomeService } from '../service/home.service';
import { RoomRepository } from '../repository/room.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HomeRepository, RoomRepository])],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService]
})
export class HomeModule {}
