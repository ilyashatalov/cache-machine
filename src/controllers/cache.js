const path = require("path");
const randomstring = require("randomstring");

const logger = require(path.join(process.cwd(), "utils", "logger"));
const Entry = require(path.join(process.cwd(), "models", "entry"));
const updateOrPopAddEntry = require(path.join(
  process.cwd(),
  "utils",
  "cache-tools"
));
require("dotenv").config();
const RANDOM_STRING_LENGTH = process.env.RANDOM_STRING_LENGTH;

exports.getCache = async (req, res) => {
  Entry.find((err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send("Error Occurred");
    }
    return res.status(200).send(result);
  });
};

exports.getKey = async (req, res) => {
  // Get key from GET URL
  const key = req.params.keyId;
  try {
    const entry = await Entry.findOne({ key });
    if (entry) {
      logger.info("Cache hit");
      return res.status(200).json(entry);
    }
    logger.info("Cache miss");
    // Generate random string for new value
    const rndStr = randomstring.generate(RANDOM_STRING_LENGTH);
    updateOrPopAddEntry(key, rndStr, (err, result) => {
      if (err) {
        logger.error(err);
        return res.status(400).json(err);
      }
      return res.status(201).json(result);
    });
  } catch (err) {
    logger.error(err, err.stack);
    return res.status(500).json(err);
  }
};
