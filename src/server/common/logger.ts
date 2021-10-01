import pino from 'pino';
var winston = require('winston');
require('winston-daily-rotate-file');

const l = pino({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL,
});

export default l;

var transport = new winston.transports.DailyRotateFile({
  filename: './logs/germene-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '10m',
  maxFiles: '2d'
});

export const logger = winston.createLogger({
  transports: [
    transport
  ]
});