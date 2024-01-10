import { connectAmqp } from './config';
import { QUEUE_KEY } from './constant';

async function setup() {
  const channel = await connectAmqp();
  // Produce messages to the queue
  // setInterval(() => {
  //   if (channel) {
  //     const message = `Message at ${new Date()}`;
  //     console.log('Producing message:', message);
  //     channel.sendToQueue(QUEUE_KEY.NEW_EMAIL, Buffer.from(message), {
  //       persistent: true,
  //     });
  //   }
  // }, 2000);

  if (channel) {
    const message = `Message at ${new Date()}`;
    console.log('Producing message:', message);
    channel.sendToQueue(QUEUE_KEY.NEW_EMAIL, Buffer.from(message), { persistent: true });
  }
}

setup().catch((error) => console.error('Error in setup:', error));
