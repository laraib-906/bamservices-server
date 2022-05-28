import * as env from "./common/env.js"
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import http from "http";
import os from "os";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import expressPinoLogger from "express-pino-logger";
import logger from "./common/loggerService.js";
import api from "./api/router.js";
import { connectDB } from "./common/database.js"
connectDB().then(
  () => {
    // Init the seed after the DB connected
    // initSeed();
  },
  () => { }
);

const app = express();
const whitelist = process.env.whitelist_url.split(',');

const corsOptions = {
  origin: function (origin, callback) {
    // callback(null, true);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // origin: '*',
  methods: "GET,PUT,POST,DELETE",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
  allowedHeaders: "Content-Type, Authorization, Credentials",
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.normalize(__dirname + "/..");
app.use(express.json({ limit: process.env.REQUEST_LIMIT || "100kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.REQUEST_LIMIT || "100kb",
  })
);
app.use(express.text({ limit: process.env.REQUEST_LIMIT || "100kb" }));
app.use(
  cookieParser("", {
    maxAge: 60 * 60 * 24 * 14 * 1000,
    httpOnly: true,
  })
);
app.use(express.static(`${root}/server/dist`));
app.use(cors(corsOptions));

const loggerMidlleware = expressPinoLogger({
  logger: logger,
  autoLogging: true,
});

app.use(loggerMidlleware);

app.use('/api', api);

const PORT = process.env.PORT || 9000;

const welcome = (p) => () =>
  logger.info(
    `up and running in ${
      process.env.NODE_ENV || "development"
    } @: ${os.hostname()} on port: ${p}}`
  );

http.createServer(app).listen(PORT, welcome(PORT));
