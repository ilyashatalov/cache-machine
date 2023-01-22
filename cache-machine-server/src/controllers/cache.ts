import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  addEntryWithRandValue,
  deleteByKeyOrAll,
  getOneEntry,
  getAllEnties,
  updateOrPopAddEntry,
} from "../services/cacheService";

export async function getCache(req: Request, res: Response) {
  return res.status(200).send(await getAllEnties());
}

export async function getKey(req: Request, res: Response) {
  // Get key from GET URL
  const key = req.params.keyId;
  try {
    const entry = await getOneEntry(key);
    if (entry) {
      return res.status(200).json(entry);
    } else {
      const result = await addEntryWithRandValue(key);
      return res.status(201).json(result);
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.stack);
      return res.status(500).json(err.message);
    } else {
      logger.error(err);
      return res.status(500).json({});
    }
  }
}

export async function postKey(req: Request, res: Response) {
  try {
    const result = await updateOrPopAddEntry(req.body.key, req.body.value);
    return res.status(201).json(result);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.stack);
      return res.status(500).json(err.message);
    } else {
      logger.error(err);
      return res.status(500).json({});
    }
  }
}

export async function deleteKey(req: Request, res: Response) {
  // Get key from GET URL
  const key = req.params.keyId;
  try {
    const entry = await deleteByKeyOrAll(key);
    if (!entry) {
      return res.status(404).json({});
    }
    return res.status(200).json(entry);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.stack);
      return res.status(500).json(err.message);
    } else {
      logger.error(err);
      return res.status(500).json({});
    }
  }
}

export async function deleteKeys(req: Request, res: Response) {
  try {
    const entry = await deleteByKeyOrAll();
    return res.status(200).json(entry);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.stack);
      return res.status(500).json(err.message);
    } else {
      logger.error(err);
      return res.status(500).json({});
    }
  }
}
