import MQTT from 'sp-react-native-mqtt';
export const getClient = async () =>{
    const client =  await MQTT.createClient({
        host: 'armadillo.rmq.cloudamqp.com',
        port: 1883,
        protocol: 'tcp',
        user: 'eywyjtgi:eywyjtgi',
        pass: 'VwGWrBH1ufex5N5J_gzc5m8jIEvva2bH',
        auth: true,
        clientId: "Mobile",
        clean: true,
    })
    client.on('closed', function() {
        console.log('mqtt.event.closed');
    });

    client.on('error', function(msg) {
        console.log('mqtt.event.error', msg);
    });
    client.on('message', function(msg) {
        console.log('mqtt.event.message', msg);
    });
    client.connect();
    return client;
};
