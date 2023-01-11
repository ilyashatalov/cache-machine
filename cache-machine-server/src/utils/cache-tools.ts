import logger from "../utils/logger";
import Entry from "../models/entry";

import config from "./config";

/**
 * Checks if we reach the limit of keys
 * @CACHE_MAX_COUNT (check it in .env file)
 * And deletes first added Entry
 */
async function checkAndPop() {
  const count = await Entry.count();
  if (count >= config.CACHE_MAX_COUNT) {
    logger.debug("There're more then + CACHE_MAX_COUNT");
    const entry = await Entry.findOneAndDelete(
      {},
      { sort: { updatedAt: 1 }, limit: 1 }
    );
    logger.info("Deleted: " + entry);
  }
}

/**
 * Takes key and value and trying to update value of @key
 * If no @key found calls {@link checkAndPop} that deletes
 * last updated item and then adds new @key with @value
 */
async function updateOrPopAddEntry(
  key: string,
  value: string
): Promise<Object> {
  const filter = { key: key };
  const update = { value: value, updatedAt: new Date() };
  const opts = { new: true };
  try {
    const result = await Entry.findOneAndUpdate(filter, update, opts);
    if (result) {
      return result.toObject();
    }

    await checkAndPop();
    const newEntryStruct = {
      key,
      value,
    };
    const newEntry = await new Entry(newEntryStruct).save();
    return newEntry.toObject();
  } catch (err: unknown) {
    logger.error(err);
    if (err instanceof Error) {
      logger.error(err.name, err.message, err.stack);
    }
    throw new Error("Something went wrong");
  }
}

export default updateOrPopAddEntry;
