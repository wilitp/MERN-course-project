import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import User from "../models/User";
import { check, validationResult } from "express-validator";
import { jwtSecret } from "../secrets";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
export const authRouter = Router();

// @route  GET api/auth
// @desc   Test route
// @access Public
authRouter.get("/", auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as AuthRequest).user.id).select(
      "-password"
    );
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

// @route POST api/auth
// @desc Login users
// @access Public
authRouter.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail().exists(),
    check("password", "Password is required").exists(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      // Check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Check if password matches
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const payload = {
        id: user.id,
      };
      const expiresIn = 3600;
      jwt.sign(payload, jwtSecret(), { expiresIn }, (err, encoded) => {
        if (err) throw err;
        return res.json({ token: encoded });
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);
