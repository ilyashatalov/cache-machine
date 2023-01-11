import * as randomstring from "randomstring";

import logger from "../utils/logger";
import Entry from "../models/entry";
import updateOrPopAddEntry from "../utils/cache-tools";

require("dotenv").config();
const RANDOM_STRING_LENGTH = parseInt(process.env.RANDOM_STRING_LENGTH);

export async function getCache (req, res) {
  Entry.find((err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send("Error Occurred");
    }
    return res.status(200).send(result);
  });
};

export async function getKey (req, res) {
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

export async function postKey (req, res) {
  const entry = new Entry({
    key: req.body.key,
    value: req.body.value,
  });
  updateOrPopAddEntry(entry.key, entry.value, (err, result) => {
    if (err) {
      logger.error(err);
      return res.status(400).json(err);
    }
    return res.status(201).json(result);
  });
};

export async function deleteKey (req, res) {
  // Get key from GET URL
  const key = req.params.keyId;
  try {
    const entry = await Entry.findOneAndDelete({ key: key });
    if (!entry) {
      return res.status(404).json({});
    }
    return res.status(200).json(entry);
  } catch (err) {
    logger.error(err, err.stack);
    return res.status(500).json(err);
  }
};

export async function deleteKeys(req, res) {
  // Get key from GET URL
  const key = req.params.keyId;
  try {
    const entry = await Entry.deleteMany({});
    return res.status(200).json(entry);
  } catch (err) {
    logger.error(err, err.stack);
    return res.status(500).json(err);
  }
};
