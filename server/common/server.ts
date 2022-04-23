import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import l, { logger } from './logger';
// import installValidator from './swagger';
const whitelist = process.env.whitelist_url.split(',');
const app = express();

const corsOptions = {
  // TODO: Set origins
  // origin: function (origin, callback) {
  //   // callback(null, true);
  //   if (!origin || whitelist.indexOf(origin) !== -1) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // },
  origin: '*',
  methods: 'GET,PUT,POST,DELETE',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization, Credentials'
};

export default class ExpressServer {
  private routes: (app: Application) => void;
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.use(express.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      express.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(express.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser('', {
      maxAge: 60 * 60 * 24 * 14 * 1000,
      httpOnly: true
    }));
    // app.use(express.static(`${root}/public`));
    app.use(express.static(`${root}/server/dist`));
    app.use(cors(corsOptions));
  }

  router(routes: (app: Application) => void): ExpressServer {
    this.routes = routes;
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        `up and running in ${process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );
    this.routes(app);
    http.createServer(app).listen(port, welcome(port));
    /* installValidator(app, this.routes)
      .then(() => {
        http.createServer(app).listen(port, welcome(port));
      })
      .catch((e) => {
        l.error(e);
        process.exit(1);
      }); */
    return app;
  }
}