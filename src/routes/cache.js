const express = require("express");
const path = require("path");

const cacheController = require(path.join(
  process.cwd(),
  "controllers",
  "cache"
));
const router = express.Router();

router.get("/keys", cacheController.getCache);

router.post("/keys", cacheController.postKey);

router.get("/keys/:keyId", cacheController.getKey);

module.exports = router;
