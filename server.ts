import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import todoRouter from "./routes/todoRouter";
import authRouter from "./routes/userRouter";

const app = express();

//body parsing middleware
app.use(express.json());

//for cross origin requests
app.use(cors());

//for disabling the x-powered-by header
app.disable("x-powered-by");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Routes
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/todos", todoRouter);

app.listen(3000, () => console.log("Server is running on port 3000"));
