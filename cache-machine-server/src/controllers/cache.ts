import * as randomstring from "randomstring";
import { Request, Response } from "express";

import logger from "../utils/logger";
import Entry from "../models/entry";
import updateOrPopAddEntry from "../utils/cache-tools";
import config from "../utils/config";

export async function getCache(req: Request, res: Response) {
  Entry.find((err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send("Error Occurred");
    }
    return res.status(200).send(result);
  });
}

export async function getKey(req: Request, res: Response) {
  // Get key from GET URL
  const key = req.params.keyId;
  try {
    const entry = await Entry.findOne({ key });
    if (entry) {
      logger.info("Cache hit");
      return res.status(200).json(entry.toObject());
    }
    logger.info("Cache miss");
    // Generate random string for new value
    const result = await updateOrPopAddEntry(
      key,
      randomstring.generate(config.RANDOM_STRING_LENGTH)
    );
    return res.status(201).json(result);
  } catch (err) {
    logger.error(err, err.stack);
    return res.status(500).json(err);
  }
}

export async function postKey(req: Request, res: Response) {
  try {
    const result = await updateOrPopAddEntry(req.body.key, req.body.value);
    return res.status(201).json(result);
  } catch (err) {
    logger.error(err, err.stack);
    return res.status(500).json(err);
  }
}

export async function deleteKey(req: Request, res: Response) {
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
}

export async function deleteKeys(req: Request, res: Response) {
  // Get key from GET URL
  const key = req.params.keyId;
  try {
    const entry = await Entry.deleteMany({});
    return res.status(200).json(entry);
  } catch (err) {
    logger.error(err, err.stack);
    return res.status(500).json(err);
  }
}
