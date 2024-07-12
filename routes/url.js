import express from "express";
import {
  generateShortUrl,
  getURL,
  shortenedUrlAnalytics,
} from "../controllers/url.js";

const router = express.Router();

router.post("/", generateShortUrl);

router.get("/:shortId", getURL);

router.get("/analytics/:shortId", shortenedUrlAnalytics);

export default router;
