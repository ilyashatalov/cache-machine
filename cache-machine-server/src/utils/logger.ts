import { createLogger, transports, format } from "winston";

import config from "./config";
const logLevel = config.LOG_LEVEL;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = createLogger({
  levels: logLevels,
  level: logLevel,
  transports: [new transports.Console()],
  format: format.combine(format.timestamp(), format.json()),
});

export default logger;
