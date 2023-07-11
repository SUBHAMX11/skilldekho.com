import express from "express";
import cors from "cors"; //cors is the express middleware connect front end to back end
import { readdirSync } from "fs"; //autoloading all route files(file system)
const morgan = require("morgan"); //morgan is the logger middleware simplifying logging requests
require("dotenv").config(); //dotenv keeps passwords, API Keys out of our code
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import csrf from "csurf";

const csrfProtection = csrf({ cookie: true });

//create express app
const app = express();

//apply middleware
app.use(cors());
app.use(express.json({ limit: "5mb" })); // data passed from front to back is json data
app.use(morgan("dev"));
app.use(cookieParser());

//db
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err));

//routes
readdirSync("./routes").map(
  (r) => app.use("/api", require(`./routes/${r}`)) //api works as a prefix like localhost/api/register
);

//csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server running on port ${port}`));
