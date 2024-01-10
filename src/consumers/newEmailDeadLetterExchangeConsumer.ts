import { Channel, Message } from 'amqplib';
import {
  EXCHANGE_KEY,
  EXCHANGE_QUEUE_ROUTING_KEY,
  QUEUE_KEY,
} from '../constant';

export const newEmailDeadLetterExchangeConsumer = async (channel: Channel) => {
  const exchangeKey = EXCHANGE_KEY.DLX_NEW_EMAIL;
  await channel.assertExchange(exchangeKey, 'direct', { durable: true });

  const queueKey = QUEUE_KEY.DLX_NEW_EMAIL;
  const args = {
    'x-dead-letter-exchange': EXCHANGE_KEY.NEW_EMAIL,
    'x-dead-letter-routing-key':
      EXCHANGE_QUEUE_ROUTING_KEY.NEW_EMAIL_ROUTING_KEY,
  };
  await channel.assertQueue(queueKey, { durable: true, arguments: args });

  channel.bindQueue(
    queueKey,
    exchangeKey,
    EXCHANGE_QUEUE_ROUTING_KEY.DLX_NEW_EMAIL_ROUTING_KEY
  );

  // Consume messages from the Dead Letter Exchange
  channel.consume(queueKey, async (msg: Message | null) => {
    if (msg && msg.properties && msg.properties.headers['x-death']) {
      const deathCount = msg.properties.headers['x-death'][0]?.count;
      if (deathCount && deathCount > 4) {
        // If the message has been rejected more than 4 times, acknowledge it to avoid requeuing
        channel.ack(msg);
      } else {
        // Log the information about the message in the Dead Letter Exchange
        console.log('DEAD QUEUE', msg.properties.headers['x-death']);
        channel.reject(msg, false)
      }
    }
  });
};
