import * as express from "express";

import * as cacheController from '../controllers/cache';

const router = express.Router();

router.get("/keys", cacheController.getCache);

router.post("/keys", cacheController.postKey);

router.delete("/keys", cacheController.deleteKeys);

router.get("/keys/:keyId", cacheController.getKey);

router.delete("/keys/:keyId", cacheController.deleteKey);

export default router;
