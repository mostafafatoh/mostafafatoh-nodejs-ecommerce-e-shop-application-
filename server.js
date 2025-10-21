const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

const compression = require("compression");

dotenv.config({ path: "config.env" });
const DBconnection = require("./config/database");
const Apierror = require("./utiles/apierror");
const globalerror = require("./middelware/errormiddelware");
const mountRoutes = require("./routes");
//connect DB

DBconnection();

//express app
const app = express();

//enable other domain to access your application
app.use(cors());
app.options(/.*/, cors());

// compress all responses
app.use(compression());

//middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
//mount routes
mountRoutes(app);

app.use((req, res, next) => {
  next(new Apierror(`can't find this route: ${req.originalUrl}`, 400));
});

//global error handling middleware for express
app.use(globalerror);
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, (req, res, next) => {
  console.log(`server run on port ${PORT}`);
});

//Handle Rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejectiion Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
