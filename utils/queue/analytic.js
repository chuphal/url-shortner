import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const analyticsQueue = new Queue("analytic-queue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {},
  },
});

export default analyticsQueue;
