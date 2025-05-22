import * as winston from 'winston';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ service, level, message, callStack, timestamp }) => {
  return `${
    service ? service : 'logger'
  }, ${timestamp}, ${level}: ${message}, callstack: ${
    callStack ? callStack : 'none'
  }`;
});

console.log({ env: process.env.NODE_ENV });

export default () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      transports: [
        new winston.transports.File({
          filename: './log/error.log',
          level: 'warn',
        }),
        new winston.transports.File({
          filename: './log/combined.log',
          level: 'silly',
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat,
      ),
    };
  } else {
    return {
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            myFormat,
          ),
        }),
      ],
    };
  }
};
