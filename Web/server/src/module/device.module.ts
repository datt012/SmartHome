import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from '../web/rest/device.controller';
import { DeviceRepository } from '../repository/device.repository';
import { DeviceService } from '../service/device.service';
import { ControllerRepository } from '../repository/controller.repository';

@Module({
    imports: [TypeOrmModule.forFeature([DeviceRepository, ControllerRepository])],
    controllers: [DeviceController],
    providers: [DeviceService],
    exports: [DeviceService],
})
export class DeviceModule {}
