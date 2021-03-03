import jwt from "jsonwebtoken";
import { jwtSecret } from "../secrets";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";

const auth = (req: Request, res: Response, next: NextFunction) => {
  // Get token from the reqeuest's header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, jwtSecret());
    if (!decoded.user) {
      return res.status(401).json({ msg: "Token is not valid" });
    }
    (req as AuthRequest).user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
