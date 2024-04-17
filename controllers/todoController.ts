import prisma from "../db";

import { Request, Response } from "express";

import { TodoWithUser } from "../types";

export const getTodos = async (req: Request, res: Response) => {
  const { user } = req;

  if (user === undefined) {
    res.status(500).json({ message: "User doesn't exist!" });
  }

  const userId: string | undefined = user?.id;

  try {
    const todos: TodoWithUser[] = await prisma.todo.findMany({
      where: { userId: userId },
    });

    res.status(200).json({
      message: "success",
      data: todos,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const { id: userId } = req.user || {};

  if (!userId) {
    res.status(400).json({
      message: "User ID is required",
    });
    return;
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        checked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json({
      message: "success",
      data: todo,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const { title, description, checked } = req.body;

  try {
    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title,
        description,
        checked,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "success",
      data: todo,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;

  if (!todoId) {
    res.status(400).json({
      message: "Todo ID is required",
    });
    return;
  }

  try {
    await prisma.todo.delete({
      where: { id: todoId },
    });

    res.status(200).json({
      message: "success",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
