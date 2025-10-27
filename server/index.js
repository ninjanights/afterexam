import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import regesterCollegeRoutes from "./routes/registerCollege.js";
import loginUserRoute from "./routes/loginUserOrCollege.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected."))
  .catch((e) => console.log("MongoDB connection error."));

app.use("/api", loginUserRoute);
app.use("/api/college", regesterCollegeRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server Live at ${PORT}.`));
