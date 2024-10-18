const express = require("express");
require("dotenv").config();
const path = require("path");
// routers
const indexRouter = require("./routes/indexRouter");
const gamesRouter = require("./routes/gamesRouter");
const genresRouter = require("./routes/genresRouter");
const developersRouter = require("./routes/developersRouter");

// set up express app
const app = express();

// middleware
// configure EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// set up static assets serving
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
// ignore browser auto favicon request
app.get("/favicon.ico", (req, res) => res.status(204).end());
// parse form data into req.body
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/", indexRouter);
app.use("/games", gamesRouter);
app.use("/genres", genresRouter);
app.use("/developers", developersRouter);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

// connect server to localhost:port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`My first Express app - listening on port ${PORT}!`)
);
