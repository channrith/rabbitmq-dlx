const QUEUE_KEY = {
  NEW_EMAIL: 'new.email',
  DLX_NEW_EMAIL: 'dl.new.email',
  CONFIRM_EMAIL: 'confirm.email',
};

const EXCHANGE_KEY = {
  NEW_EMAIL: 'new.email.x',
  DLX_NEW_EMAIL: 'new.email.dlx',
  CONFIRM_EMAIL: 'confirm.email.x',
};

const EXCHANGE_QUEUE_ROUTING_KEY = {
  NEW_EMAIL_ROUTING_KEY: 'x.new.email.routing.key',
  DLX_NEW_EMAIL_ROUTING_KEY: 'dlx.new.email.routing.key',
  DLX_CONFIRM_EMAIL_ROUTING_KEY: 'dlx.confirm.email.routing.key',
};

export {
  QUEUE_KEY,
  EXCHANGE_KEY,
  EXCHANGE_QUEUE_ROUTING_KEY,
};
