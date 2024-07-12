import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    require: true,
    unique: true,
  },
  originalURL: {
    type: String,
    required: true,
  },
  visitors: [
    {
      timestamp: {
        type: Date,
        default: Date.now(),
      },
      ipAddress: String,
      userAgent: String,
      deviceType: String,
    },
  ],
  visitCount: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  deviceType: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const URL = mongoose.model("URL", UrlSchema);

export default URL;
