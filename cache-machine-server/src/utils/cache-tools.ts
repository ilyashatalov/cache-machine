import logger from "../utils/logger";
import Entry from "../models/entry";

require("dotenv").config();
const CACHE_MAX_COUNT = parseInt(process.env.CACHE_MAX_COUNT);

/**
 * Takes key and value and trying to update value of @key
 * If no @key found check for count of keys and if it's more
 * then CACHE_MAX_COUNT (check it in .env file) deletes
 * last updated item
 */

async function checkAndPop() {
  const count = await Entry.count();
  if (count >= CACHE_MAX_COUNT) {
    logger.debug("There're more then + CACHE_MAX_COUNT");
    const entry = await Entry.findOneAndDelete(
      {},
      { sort: { updatedAt: 1 }, limit: 1 }
    );
    logger.info("Deleted: " + entry);
  }
}

async function updateOrPopAddEntry(key, value, callback) {
  const filter = { key: key };
  const update = { value: value, updatedAt: new Date() };
  const opts = { new: true };
  try {
    const result = await Entry.findOneAndUpdate(filter, update, opts);
    if (result) {
      return callback(null, result);
    }

    await checkAndPop();
    const newEntrystruct = {
      key,
      value,
    }
    await new Entry(newEntrystruct).save();
    return callback(null, newEntrystruct);
  } catch (err) {
    logger.error(err, err.stack);
    return callback(err, null);
  }
}

export default updateOrPopAddEntry;
