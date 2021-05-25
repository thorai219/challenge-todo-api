const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
const publicDomain = process.env.PUBLIC_DOMAIN || "http://localhost:3000";

const config = require("./config/db");

const app = express();

mongoose.Promise = global.Promise;
mongoose
  .connect(config.DB, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database is connected");
    },
    (err) => {
      console.log("Can not connect to the database" + err);
    }
  );

const todoRoute = require("./routes/todoRoute");
const authRoute = require("./routes/authRoute");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [publicDomain],
  })
);
app.use(morgan("tiny"));

app.use("/api/v1", todoRoute);
app.use("/api/v1/", authRoute);

const server = app.listen(port, function () {
  console.log("Listening on port " + port);
});
