import { Channel, Message } from 'amqplib';
import {
  ENV,
  EXCHANGE_KEY,
  EXCHANGE_QUEUE_ROUTING_KEY,
  QUEUE_KEY,
} from '../constant';

export const confirmEmailExchangeConsumer = async (channel: Channel) => {
  const exchangeKey = EXCHANGE_KEY.CONFIRM_EMAIL;
  await channel.assertExchange(exchangeKey, 'fanout', { durable: true });

  // Declare a queue with Dead Letter Exchange arguments
  const queueKey = QUEUE_KEY.CONFIRM_EMAIL;
  const args = {
    'x-dead-letter-exchange': exchangeKey,
    'x-dead-letter-routing-key':
      EXCHANGE_QUEUE_ROUTING_KEY.DLX_CONFIRM_EMAIL_ROUTING_KEY,
  };
  await channel.assertQueue(queueKey, { durable: true, arguments: args });

  channel.bindQueue(queueKey, exchangeKey, '');

  channel.consume(queueKey, async (msg: Message | null) => {
    try {
      if (msg) {
        console.log(`${queueKey} Received message:`, msg.content.toString());
        // throw new Error('Simulated processing error');
        channel.ack(msg); // Acknowledge the message if processed successfully
      } else {
        console.warn('Received null message');
      }
    } catch (error: any) {
      // If processing fails, reject the message and it will be sent to the Dead Letter Exchange
      console.error('Error processing message:', error.message);
      if (msg) {
        // Reject the message without requeueing
        setTimeout(() => channel.reject(msg, false), Number(ENV.RETRY_INTERVAL));
      }
    }
  });
};
