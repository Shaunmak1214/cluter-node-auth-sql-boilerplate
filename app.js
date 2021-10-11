const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { swaggerDocument, swaggerOptions } = require('./swagger.config');
const routes = require('./src/routes');

// Modules
const logger = require('./winston-config');

require('dotenv').config();

module.exports.clusteringApp = () => {
  let port = process.env.PORT;
  if (isNaN(parseInt(port))) {
    port = 3000;
  }
  // create express app
  const app = express();

  // Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(helmet());
  app.use(cors());

  //  set limit request from same API in timePeroid from same ip
  const limiter = rateLimit({
    max: 100, //   max number of limits
    windowMs: 60 * 60 * 1000, // hour
    message: ' Too many req from this IP , please Try  again in an Hour ! ',
  });

  app
    .get('/', (req, res) => {
      res.send('Welcome to the ITS Email API');
    })
    .use(limiter);

  app.use('/api', limiter);

  if (process.env.NODE_ENV !== 'production') {
    // app.use(morgan('dev'));
    app.use(
      morgan('dev', {
        stream: logger.stream,
        // only log error responses
        // skip: (req, res) => {
        //     return res.statusCode < 400;
        // },
      }),
    );
  }

  // slow Api
  app.get('/api/slow', function (req, res) {
    console.time('slowApi');
    const baseNumber = 7;
    let result = 0;
    for (let i = Math.pow(baseNumber, 7); i >= 0; i--) {
      result += Math.atan(i) * Math.tan(i);
    }
    console.timeEnd('slowApi');

    console.log(`Result number is ${result} - on process ${process.pid}`);
    res.send(`Result number is ${result}`);
  });

  const swaggerDocs = swaggerJSDoc(swaggerDocument);
  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocs, swaggerOptions),
  );

  // db.sequelize.sync()
  //   .then(() => {
  //     logger.info('We are connected to the database')
  //   })
  //   .catch((err) => {
  //     logger.error(`Unable to connect to the database:' ${err.message}`)
  //     throw new Error(`Unable to connect to the database:' ${err.message}`)
  //   })

  app.use('/api', routes);

  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });

  // error handler middleware
  app.use((error, req, res, next) => {
    logger.error(`Error occured: ${error}`);
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
      },
    });
  });

  const server = app.listen(port, () => {
    logger.info(`server started on port ${port}`);
  });

  process.on('SIGINT', () => {
    logger.warn('SIGINT RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  });
};
