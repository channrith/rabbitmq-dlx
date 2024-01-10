import { connectAmqp } from '../config';

const startConsumers = async () => {
  try {
    (global as any).execConsumerLoader = true;
    await connectAmqp();
  } catch (error) {
    console.log('consumers error: ', error);
  }
};

startConsumers();
