import { Channel } from 'amqplib';
import { newEmailExchangeConsumer } from './newEmailExchangeConsumer';
import { newEmailDeadLetterExchangeConsumer } from './newEmailDeadLetterExchangeConsumer';
import { confirmEmailExchangeConsumer } from './confirmEmailExchangeConsumer';

const consumerLoader = async (channel: Channel) => {
  await newEmailExchangeConsumer(channel);
  await newEmailDeadLetterExchangeConsumer(channel);
  await confirmEmailExchangeConsumer(channel);
  console.log('Consumer is ready');
};

export default consumerLoader;
