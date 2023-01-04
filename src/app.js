const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const Entry = require(path.join(process.cwd(), "models", "entry"));

require("dotenv").config();
const mongoString = process.env.DATABASE_URL;

const app = express();
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(bodyParser.json()); // to support JSON-encoded bodies

mongoose
  .set("strictQuery", false)
  .connect(mongoString)
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

    app.listen(3000, () => {
      console.log(`Server Started at ${3000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app