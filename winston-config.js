const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');
// Logging levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Show until debug level for development
// Show until warn level for production
const level = () => {
  const env = process.env.NODE.ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// show which file it's coming from
const getFileLocation = (callingModule) => {
  const parts = callingModule.filename.split(path.sep);
  const result = path.join(parts[parts.length - 2], parts.pop());
  return result;
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Winston logger configuraiton
const logger = (callingModule) => {
  const fileLocation = getFileLocation(callingModule);
  return winston.createLogger({
    level: level(),
    levels,
    exitOnError: false,
    transports: [
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      new winston.transports.DailyRotateFile({
        filename: 'logs/%DATE%-error.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        maxsize: 1024 * 1024 * 10, // 10MB
      }),
      new winston.transports.DailyRotateFile({
        filename: 'logs/%DATE%-combined.log',
        datePattern: 'YYYY-MM-DD',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        maxsize: 1024 * 1024 * 10, // 10MB
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        label: getFileLocation(callingModule),
        json: false,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.printf(
            (info) =>
              `[${info.timestamp}] - ${info.level} [${fileLocation}] : ${info.message}`,
          ),
        ),
      }),
    ],
  });
};
logger.stream = {
  write: (message) => {
    logger.http(message);
  },
};

module.exports = (callingModule) => logger(callingModule);
