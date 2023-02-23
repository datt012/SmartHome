import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorController } from '../web/rest/sensor.controller';
import { SensorRepository } from '../repository/sensor.repository';
import { SensorService } from '../service/sensor.service';
import { ControllerRepository } from '../repository/controller.repository';

@Module({
    imports: [TypeOrmModule.forFeature([SensorRepository, ControllerRepository])],
    controllers: [SensorController],
    providers: [SensorService],
    exports: [SensorService],
})
export class SensorModule {}
