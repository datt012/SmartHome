import { MqttModuleOptions } from 'nest-mqtt';

async function mqttConfig(): Promise<MqttModuleOptions> {
  return {
    host: 'armadillo.rmq.cloudamqp.com',
    port: 1883,
    protocol: 'mqtt',
    username: 'eywyjtgi:eywyjtgi',
    password: 'VwGWrBH1ufex5N5J_gzc5m8jIEvva2bH'
  };
}

export { mqttConfig };
