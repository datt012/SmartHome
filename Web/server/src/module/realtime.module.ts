import { Module } from '@nestjs/common';
import { LogModule } from './log.module';
import { RealtimeService } from '../service/realtime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogRepository } from '../repository/log.repository';
import { SensorRepository } from '../repository/sensor.repository';
import { DeviceRepository } from '../repository/device.repository';
import { ControllerRepository } from '../repository/controller.repository';
import { RealtimeController } from '../web/rest/realtime.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogRepository, SensorRepository, DeviceRepository, ControllerRepository]),
    LogModule
  ],
  controllers: [RealtimeController],
  providers: [RealtimeService],
  exports: [],
})
export class RealtimeModule {}
