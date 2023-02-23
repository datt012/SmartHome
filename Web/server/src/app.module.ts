import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { config } from './config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HomeModule } from './module/home.module';
import { RoomModule } from './module/room.module';
import { PermissionModule } from './module/permission.module';
import { DeviceModule } from './module/device.module';
import { LogModule } from './module/log.module';
import { ControllerModule } from './module/controller.module';
import { SensorModule } from './module/sensor.module';
import { MqttModule } from 'nest-mqtt';
import { mqttConfig } from './mqtt.config';
import { RealtimeModule } from './module/realtime.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
import { CloudinaryController } from './web/rest/cloudinary.controller';
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
import { CloudinaryService } from './service/cloudinary.service';

// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    ServeStaticModule.forRoot({
      rootPath: config.getClientPath(),
    }),
    MqttModule.forRootAsync({ useFactory: mqttConfig }),
    AuthModule,
    HomeModule,
    RoomModule,
    PermissionModule,
    DeviceModule,
    LogModule,
    ControllerModule,
    SensorModule,
    RealtimeModule,
    // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
  ],
  controllers: [
    CloudinaryController,
    // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
  ],
  providers: [
    CloudinaryService,
    // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
  ],
})
export class AppModule {}
