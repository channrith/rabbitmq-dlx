import amqp, { Channel, Connection } from 'amqplib';
import { ENV } from '../constant';
import consumerLoader from '../consumers/consumersLoader';

const amqpConnectionURI = `amqp://${ENV.RABBITMQ_HOST}`;

let connection: Connection;
let channel: Channel;
let isConnected = false;

const connectAmqp = async (): Promise<Channel | undefined> => {
  try {
    if (connection && channel && isConnected) return channel;
    connection = await amqp.connect(amqpConnectionURI);

    connection.on('close', (err) => {
      console.error(`${ENV.RABBITMQ_HOST} connection closed: ${err}`);
      isConnected = false;
      setTimeout(connectAmqp, Number(ENV.RETRY_INTERVAL));
    });

    connection.on('error', (err) => {
      console.error(`${ENV.RABBITMQ_HOST} connection error: ${err}`);
      isConnected = false;
      setTimeout(connectAmqp, Number(ENV.RETRY_INTERVAL));
    });

    channel = await connection.createChannel();
    isConnected = true;
    console.log(`${ENV.RABBITMQ_HOST} connected`);

    if ((global as any).execConsumerLoader) await consumerLoader(channel);

    return channel;
  } catch (error) {
    console.error(`${ENV.RABBITMQ_HOST} reconnecting`);
    setTimeout(connectAmqp, Number(ENV.RETRY_INTERVAL));
    isConnected = false;
    return undefined;
  }
};

export { connectAmqp };
