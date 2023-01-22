import logger from "./logger";

const standartErrorMessage = "Server error. Contact system administrator";

/**
 * /**
 * Proccess an error, log it and throws new error string
 * for the client without any data with error details
 * @param err - error obj or unknown
 * @param msg - string for the client.
 * if no msg - standart message returned
 */
export async function ServiceErrorProcessor(
  err: Error | unknown,
  msg?: string
) {
  if (err instanceof Error) {
    logger.error(err.stack);
  } else {
    logger.error(err);
  }
  if (msg) {
    return msg;
  } else {
    return standartErrorMessage;
  }
}
