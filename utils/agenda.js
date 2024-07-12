import Agenda from "agenda";
import dotenv from "dotenv";
import URL from "../models/url.js";
import redis from "./redis.js";

dotenv.config();
const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI,
    collection: "schedule",
    options: { useNewUrlParser: true, useUnifiedTopology: true },
  },
});

agenda.define("delete-link", async (job) => {
  const { shortId } = job.attrs.data;

  //task
  try {
    await URL.findOneAndDelete({ shortId });
    await redis.del(shortId);
    console.log("link deleted successfully");
  } catch (error) {
    console.log("error while delete-link task", error);
  }
});

agenda.on("ready", async () => {
  console.log("Agenda is ready!");
  await agenda.start();
});

agenda.on("error", (error) => {
  console.error("Agenda connection error:", error);
});

export default agenda;
