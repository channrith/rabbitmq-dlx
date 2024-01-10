import { Channel, Message } from 'amqplib';
import {
  EXCHANGE_KEY,
  EXCHANGE_QUEUE_ROUTING_KEY,
  QUEUE_KEY,
} from '../constant';

export const newEmailExchangeConsumer = async (channel: Channel) => {
  const exchangeKey = EXCHANGE_KEY.NEW_EMAIL;
  await channel.assertExchange(exchangeKey, 'direct', { durable: true });

  const queueKey = QUEUE_KEY.NEW_EMAIL;
  const args = {
    'x-dead-letter-exchange': EXCHANGE_KEY.DLX_NEW_EMAIL,
    'x-dead-letter-routing-key':
      EXCHANGE_QUEUE_ROUTING_KEY.DLX_NEW_EMAIL_ROUTING_KEY,
  };
  await channel.assertQueue(queueKey, { durable: true, arguments: args });

  channel.bindQueue(
    queueKey,
    exchangeKey,
    EXCHANGE_QUEUE_ROUTING_KEY.NEW_EMAIL_ROUTING_KEY
  );

  // Consume messages from the Dead Letter Exchange
  channel.consume(queueKey, async (msg: Message | null) => {
    try {
      if (msg) {
        // Process the message (simulating success)
        console.log('Processing message:', msg.content.toString());
        throw new Error('Simulated processing error');
        // channel.ack(msg); // Acknowledge the message if processed successfully
      } else {
        console.warn('Received null message');
      }
    } catch (error: any) {
      // If processing fails, reject the message and it will be sent to the Dead Letter Exchange
      console.error('Error processing message:', error.message);
      if (msg) {
        // Reject the message without requeueing
        channel.reject(msg, false);
      }
    }
  });
};
