const { createLogger, format, transports } = require('winston');
const { splat, combine, timestamp, label, printf, simple } = format;

const logger = createLogger({
    level: 'silly',
    format: format.json(),
    /*format: combine(
        label({ label: 'CUSTOM', message: true }),
        timestamp(),
            simple()
      ),*/
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.Console({level: 'error'}),
      new transports.File({ filename: 'combined.log', level: 'silly' }),
    ],
  });

module.exports = logger;