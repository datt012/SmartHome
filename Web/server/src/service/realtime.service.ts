import {Injectable} from '@nestjs/common';
import {Subscribe, Payload, Params} from 'nest-mqtt';
import {InjectRepository} from '@nestjs/typeorm';
import {LogRepository} from '../repository/log.repository';
import {SensorRepository} from '../repository/sensor.repository';
import {Sensor} from '../domain/sensor.entity';
import {Log} from '../domain/log.entity';
import {DeviceRepository} from '../repository/device.repository';
import {pusher} from '../pusher';
import {ControllerRepository} from '../repository/controller.repository';

@Injectable()
export class RealtimeService {

  constructor(
    @InjectRepository(ControllerRepository) private readonly controllerRepository: ControllerRepository,
    @InjectRepository(SensorRepository) private readonly sensorRepository: SensorRepository,
    @InjectRepository(DeviceRepository) private readonly deviceRepository: DeviceRepository,
    @InjectRepository(LogRepository) private readonly logRepository: LogRepository
  ) {}

  @Subscribe({
    topic: '+/sensors/+'
  })
  async readTemperature(@Payload() payload, @Params() params) {
    const controllerId = params[0];
    const sensorId = params[1];
    const controller = await this.controllerRepository.findOne(controllerId);
    const sensor = await this.sensorRepository.findOne(sensorId);
    if (controller && sensor) {
      const log: Log = {
        description: JSON.stringify(payload['data']),
        createdAt: payload['time'],
        createdBy: payload['creator']
      };
      const savedLog = await this.logRepository.save(log);
      sensor.logs.push(savedLog);
      await this.sensorRepository.update(sensor.id, sensor);
      await pusher.trigger(`private-sensor_${sensorId}`, 'update', savedLog);
    }
  }

  @Subscribe({
    topic: '+/devices/+',
  })
  async readDevice(@Payload() payload, @Params() params) {
    const controllerId = params[0];
    const deviceId = params[1];
    const controller = await this.controllerRepository.findOne(controllerId);
    const device = await this.deviceRepository.findOne(deviceId);
    if (controller && device) {
      device.status = payload['data']['status'];
      const log: Log = {
        description: `${payload['device']}: ${payload['data']['status']}`,
        createdAt: payload['time'],
        createdBy: payload['creator']
      };
      const savedLog = await this.logRepository.save(log);
      device.logs.push(savedLog);
      await this.deviceRepository.update(device.id, device);
      await pusher.trigger(`private-device_${deviceId}`, 'update-status', savedLog);
    }
  }
}
