import * as dotenv from "dotenv";

// Default Values
enum DefaultConfig {
  APP_PORT = 3000,
  RANDOM_STRING_LENGTH = 14,
  CACHE_MAX_COUNT = 100,
  KEY_TTL = 3600,
  LOG_LEVEL = "info",
}
// Parsing the env file.
dotenv.config();

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  APP_PORT: number | undefined;
  DATABASE_URL: string | undefined;
  RANDOM_STRING_LENGTH: number | undefined;
  CACHE_MAX_COUNT: number | undefined;
  KEY_TTL: number | undefined;
  LOG_LEVEL: string | undefined;
}

interface Config {
  APP_PORT: number;
  DATABASE_URL: string;
  RANDOM_STRING_LENGTH: number;
  CACHE_MAX_COUNT: number;
  KEY_TTL: number;
  LOG_LEVEL: string;
}
// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    APP_PORT: process.env.APP_PORT
      ? Number(process.env.APP_PORT)
      : DefaultConfig.APP_PORT,
    RANDOM_STRING_LENGTH: process.env.RANDOM_STRING_LENGTH
      ? Number(process.env.RANDOM_STRING_LENGTH)
      : DefaultConfig.RANDOM_STRING_LENGTH,
    CACHE_MAX_COUNT: process.env.CACHE_MAX_COUNT
      ? Number(process.env.CACHE_MAX_COUNT)
      : DefaultConfig.CACHE_MAX_COUNT,
    KEY_TTL: process.env.KEY_TTL
      ? Number(process.env.KEY_TTL)
      : DefaultConfig.KEY_TTL,
    LOG_LEVEL: process.env.LOG_LEVEL
      ? String(process.env.LOG_LEVEL)
      : DefaultConfig.LOG_LEVEL,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(
        `Missing key ${key} in .env file or OS ENVIRONMENT variable`
      );
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
