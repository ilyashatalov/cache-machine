import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as path from "path";

import logger from "./utils/logger";
import Entry from "./models/entry";
import cacheRouter from "./routes/cache";

(async function() {
  await import("dotenv/config")
})()


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
  .connect(process.env.DATABASE_URL)
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
      app.listen(3000, () => {
        logger.info(`Server Started at ${3000}`);
      });
    }
  })
  .catch((err) => {
    logger.info('here')
    logger.info(err.stack);
  });

