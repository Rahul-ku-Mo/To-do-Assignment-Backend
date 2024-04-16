import { Response, Request } from "express";
import prisma from "../db";

import {
  signToken,
  hashedPassword,
  validatePassword,
} from "../utils/validation";

import { User } from "../types";

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

export const createSendToken = (user: User, res: Response) => {
  const token = signToken(user.id);

  const CookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    CookieOptions.secure = true;
  }

  res.cookie("jwt", token, CookieOptions);

  return token;
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  //1.check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  //2.if not an existing user hash the password and store it in the database
  const cryptPassword = await hashedPassword(password);

  //3.create the user and store it in the database
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: cryptPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    const accesstoken = createSendToken(user, res);

    res.status(201).json({
      message: "success",
      data: user,
      accesstoken,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req : Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ status: 400, message: "Please provide a email and password" });

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user)
    return res
      .status(401)
      .json({ status: 401, message: "Invalid email. Check again!" });

  const passwordMatch = await validatePassword(password, user.password);

  if (!passwordMatch) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid password. Check again!" });
  }

  const accesstoken = createSendToken(user, res);
  //eliminate the password field!!
  user.password = null;

  res.status(200).json({
    message: "success",
    accesstoken,
    data: user,
  });
};

