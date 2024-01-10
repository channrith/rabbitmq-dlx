import * as dotenv from 'dotenv';
dotenv.config();

const {
  RETRY_INTERVAL,
  RABBITMQ_HOST,
  RABBITMQ_USER,
  RABBITMQ_PASSWORD,
  RABBITMQ_VHOST,
} = process.env;

const ENV = {
  RETRY_INTERVAL: Number(RETRY_INTERVAL) || 3000,
  RABBITMQ_HOST,
  RABBITMQ_USER,
  RABBITMQ_PASSWORD,
  RABBITMQ_VHOST,
};

export default ENV;
