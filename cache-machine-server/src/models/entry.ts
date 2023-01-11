import * as mongoose from "mongoose";
require("dotenv").config();

const KEY_TTL = parseInt(process.env.KEY_TTL);

var entrySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
  updatedAt: {
    expires: KEY_TTL,
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export default mongoose.model("Entry", entrySchema);
