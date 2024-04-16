import express from "express";
import cors from "cors";
import authRouter from "./routes/userRouter";
import todoRouter from "./routes/todoRouter";

const app = express();

//body parsing middleware
app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

// Routes
app.use("/api/v1/", authRouter);

app.use("/api/v1/todos", todoRouter);

app.listen(3000, () => console.log("Server is running on port 3000"));
