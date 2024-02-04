require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
mongoose.connect(process.env.MONGO_URI);
const { Category } = require("./models");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");
const categoryRouter = require("./routes/categoryRouter");
const itemRouter = require("./routes/itemRouter");
const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};
app.use(logger);
app.route("/").get(async (req, res) => {
  const categories = await Category.find();
  res.render("index", {
    title: "Inventory App",
    categories: categories.map((i) => i.name),
  });
});
app.use("/category", categoryRouter);
app.use("/item", itemRouter);
module.exports = app;
