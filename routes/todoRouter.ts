import { authenticateToken } from "../utils/validation";
import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todoController";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getTodos).post("/", createTodo);

router.put("/:todoId", updateTodo).delete("/:todoId", deleteTodo);

export default router;
