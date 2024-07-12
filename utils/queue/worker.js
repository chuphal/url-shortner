import { Worker } from "bullmq";
import URL from "../../models/URL.js";
import redis from "../redis.js";
import { NotFoundError } from "../../errors/not-found.js";
import dotenv from "dotenv";

dotenv.config();

const worker = new Worker(
  "analytic-queue",
  async (task) => {
    console.log(`Message with id: ${task.id}`);

    const shortId = task.data.shortId;
    console.log(`shortId: ${shortId}`);

    let entry;
    entry = await URL.findOne({ shortId });

    console.log(entry);
    if (!entry) {
      throw new NotFoundError("URL not found");
    } else {
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

      return analyticsData;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      tls: {},
    },
  }
);

worker.on("completed", (task) => {
  console.log(`task ${task.id} completed!`);
});

worker.on("failed", (task, err) => {
  console.log(`task ${task.id} failed with error ${err.message}`);
});
