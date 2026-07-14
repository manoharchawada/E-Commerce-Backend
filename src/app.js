import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
const app = express();

// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);

app.get("/", (req, res) => {
  return res.send("Health Check Working fine");
});
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
// router imports
import userRouter from "./routes/user.routes.js";
import sellerRouter from "./routes/seller.routes.js";
// // router declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/seller", sellerRouter);
export { app };
