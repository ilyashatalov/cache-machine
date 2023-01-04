const path = require("path");

const Entry = require(path.join(process.cwd(), "models", "entry"));

exports.getCache = async (req, res) => {
  Entry.find((err, result) => {
    if (err) {
      logger.error(err);
      return res.status(500).send("Error Occurred");
    }
    return res.status(200).send(result);
  });
};