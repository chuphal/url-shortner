import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";
import { BadRequestError } from "../errors/bad-request.js";
import URL from "../models/URL.js";
import { CustomAPIError } from "../errors/custom-api.js";
import { UAParser } from "ua-parser-js";
import { NotFoundError } from "../errors/not-found.js";
import agenda from "../utils/agenda.js";
import redis from "../utils/redis.js";

export const generateShortUrl = async (req, res) => {
  const { customId, originalUrl, timeToExpire } = req.body;

  if (!originalUrl) {
    throw new BadRequestError("please, provide the url to be shortened");
  }

  if (customId) {
    const entry = await URL.find({ shortId: customId });

    if (entry.length > 0) {
      throw new BadRequestError(
        "ShortId provided is already present. Please provide the new one"
      );
    }
  }

  let shortId = customId || nanoid(10);

  const delay = timeToExpire || "1 hour";

  try {
    const schedule = await agenda.schedule(`in ${delay}`, "delete-link", {
      shortId,
    });
    await URL.create({
      shortId,
      originalURL: originalUrl,
    });

    res.status(StatusCodes.CREATED).json({
      msg: "successfully generated",
      shorturlId: shortId,
      originalUrl,
      shortUrlLink: `https://url-shortner-lb0f.onrender.com/api/v1/url/${shortId}`,
    });
  } catch (error) {
    console.log("error in generateshorturl controller", error);
    throw new CustomAPIError("Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getURL = async (req, res) => {
  const shortId = req.params.shortId;

  if (await redis.exists(shortId)) {
    await redis.del(shortId);
  }

  const url = await URL.findOne({ shortId });
  if (!url) {
    throw new NotFoundError("URL not found");
  }

  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];
  let parser = new UAParser(userAgent);
  let result = parser.getResult();
  const deviceType = result.device.type || "desktop";

  url.visitCount += 1;
  url.deviceType[deviceType] += 1;

  url.visitors.push({ userAgent, ipAddress, deviceType });
  const uniqueVisitors = new Set(
    url.visitors.map((visitor) => visitor.ipAddress)
  ).size;

  url.uniqueVisitors = uniqueVisitors;
  await url.save();

  res.redirect(StatusCodes.MOVED_TEMPORARILY, url.originalURL);
};

export const shortenedUrlAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  let entry;

  if (await redis.exists(shortId)) {
    res.status(StatusCodes.OK).json(JSON.parse(await redis.get(shortId)));
  } else {
    entry = await URL.findOne({ shortId });

    if (!entry) {
      throw new NotFoundError("URL not found");
    }

    const visitsByDay = entry.visitors.reduce((acc, visitor) => {
      const day = visitor.timestamp.toISOString().split("T")[0];
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += 1;
      return acc;
    }, {});

    const visitsByHour = entry.visitors.reduce((acc, visitor) => {
      const hour = visitor.timestamp.toISOString().slice(0, 13);
      if (!acc[hour]) {
        acc[hour] = 0;
      }
      acc[hour] += 1;
      return acc;
    }, {});

    const analyticsData = {
      originalUrl: entry.originalURL,
      totalVisits: entry.visitCount,
      uniqueVisits: entry.uniqueVisitors,
      deviceTypes: entry.deviceType,
      visitsByDay,
      visitsByHour,
      visitHistory: entry.visitors,
    };

    await redis.set(shortId, JSON.stringify(analyticsData));
    res.status(StatusCodes.OK).json(analyticsData);
  }
};
