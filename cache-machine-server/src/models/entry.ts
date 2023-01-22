import * as mongoose from "mongoose";
import config from "../utils/config";

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
    expires: config.KEY_TTL,
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export default mongoose.model("Entry", entrySchema);
