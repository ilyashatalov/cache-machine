const path = require("path");

const logger = require(path.join(process.cwd(), "utils", "logger"));
const Entry = require(path.join(process.cwd(), "models", "entry"));

require("dotenv").config();
const CACHE_MAX_COUNT = process.env.CACHE_MAX_COUNT;

async function updateOrPopAddEntry(key, value, callback) {
  const filter = { key: key };
  const update = { value: value, updatedAt: new Date() };
  const opts = { new: true };
  try {
    result = await Entry.findOneAndUpdate(filter, update, opts);
    if (result) {
      return callback(null, result);
    }

    const count = await Entry.count();
    if (count >= CACHE_MAX_COUNT) {
      logger.debug("There're more then 10  "+ count);
      const entry = await Entry.findOneAndDelete({}, { sort: {updatedAt: 1 }, limit: 1});
      logger.info("Deleted: "+ entry);
    }
    const newEntry = new Entry({
      key,
      value,
    });
    await newEntry.save();
    return callback(null, newEntry);
  } catch (err) {
    logger.error(err);
    return callback(err, null);
  }
}

module.exports = updateOrPopAddEntry;
