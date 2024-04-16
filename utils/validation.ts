import { Response, Request } from "express";

import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../types";


declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const signToken = (id: string) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_SECRET_EXPIRATION,
  });
};

export const hashedPassword = async (userPassword: string) => {
  return await bcrypt.hash(userPassword, 12);
};

export const validatePassword = async (
  clientPassword: string,
  databasePassword: string | null
) => {
  return await bcrypt.compare(clientPassword, databasePassword as string);
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: () => void
) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as Secret,
    (err: Error | null, decoded: any) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid token or Expired token" });
      }

      req.user = decoded;

      next();
    }
  );
};
