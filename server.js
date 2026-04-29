require("dotenv").config({ path: "./config.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const { nanoid } = require("nanoid");
const Url = require("./models/url.js");
const port = process.env.port || 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("successfully connected to db");
  })
  .catch((err) => {
    console.log("failed to connect");
    console.log(err.message);
  });
app.get("/", (req, res) => {
  res
    .status(200)
    .render("index", { purl: `${req.protocol}://${req.get("host")}` });
});
app.post("/shortUrl", async (req, res) => {
  const url = req.body.url;
  const shortId = nanoid(6);
  const newUrl = await Url.create({
    originalUrl: url,
    shortId,
  });
  res.status(201).json({
    status: "success",
    data: {
      url: newUrl,
    },
  });
});
app.get("/shortUrl/:urlId", async (req, res) => {
  const urlId = req.params.urlId;
  const url = await Url.findOne({ shortId: urlId });
  res.redirect(`${url.originalUrl}`);
});
app.get("/allurls", async (req, res) => {
  const urls = await Url.find();
  res.status(201).json({
    status: "success",
    data: {
      urls,
    },
  });
});
app.listen(3000, () => {
  console.log("listenning  on port 3000");
});
