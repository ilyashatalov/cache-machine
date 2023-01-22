import Entry from "../models/entry";
import logger from "../utils/logger";
import * as randomstring from "randomstring";
import config from "../utils/config";
import { ServiceErrorProcessor } from "../utils/error-processors";

export async function getAllEnties() {
  try {
    const result = await Entry.find();
    return result;
  } catch (err) {
    throw new Error(await ServiceErrorProcessor(err));
  }
}

export async function getOneEntry(key: string) {
  try {
    const entry = await Entry.findOne({ key });
    if (entry) {
      logger.info("Cache hit");
      const filter = { key: key };
      const update = { updatedAt: new Date() };
      const opts = { new: true };
      const result = await Entry.findOneAndUpdate(filter, update, opts);
      if (result) return result.toObject();
    }
    return undefined;
  } catch (err) {
    throw new Error(await ServiceErrorProcessor(err));
  }
}

export async function addEntryWithRandValue(key: string) {
  try {
    const result = await updateOrPopAddEntry(
      key,
      randomstring.generate(config.RANDOM_STRING_LENGTH)
    );
    return result;
  } catch (err) {
    throw new Error(await ServiceErrorProcessor(err));
  }
}

export async function deleteByKeyOrAll(key?: string) {
  try {
    if (key) {
      const entry = await Entry.findOneAndDelete({ key: key });
      return entry;
    } else {
      const entry = await Entry.deleteMany({});
      return entry;
    }
  } catch (err) {
    throw new Error(await ServiceErrorProcessor(err));
  }
}

/**
 * Checks if we reach the limit of keys
 * @CACHE_MAX_COUNT (check it in .env file)
 * And deletes first added Entry
 */
export async function checkCountAndPop() {
  try {
    const count = await Entry.count();
    if (count >= config.CACHE_MAX_COUNT) {
      logger.debug(`There're more then ${config.CACHE_MAX_COUNT} items`);
      const entry = await Entry.findOneAndDelete(
        {},
        { sort: { updatedAt: 1 }, limit: 1 }
      );
      logger.info(`Deleted: ${entry}`);
    }
  } catch (err) {
    throw new Error(await ServiceErrorProcessor(err));
  }
}

/**
 * Takes key and value and trying to update value of @key
 * If no @key found calls {@link checkAndPop} that deletes
 * last updated item and then adds new @key with @value
 */
export async function updateOrPopAddEntry(
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
    await checkCountAndPop();
    const newEntryStruct = {
      key,
      value,
    };
    const newEntry = await new Entry(newEntryStruct).save();
    return newEntry.toObject();
  } catch (err: unknown) {
    throw new Error(await ServiceErrorProcessor(err));
  }
}
