import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";

import logger from "./utils/logger";
import Entry from "./models/entry";
import cacheRouter from "./routes/cache";
import config from "./utils/config";

export const app = express();
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(cacheRouter);

mongoose
  .set("strictQuery", false)
  .connect(config.DATABASE_URL)
  .then(() => {
    // Create first test doc
    var query = {},
      update = { key: "Test1", value: "Value1" },
      options = { upsert: true };

    Entry.findOneAndUpdate(query, update, options, function (error, result) {
      if (!error) {
        if (!result) {
          result = new Entry({
            key: "Test1",
            value: "Value1",
          });
        }
      }
    });
    if (process.env.NODE_ENV !== "test") {
      app.listen(config.APP_PORT, () => {
        logger.info(`Server Started at ${config.APP_PORT}`);
      });
    }
  })
  .catch((err) => {
    logger.info(err.stack);
  });
