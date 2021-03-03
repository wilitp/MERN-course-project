import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
export const usersRouter = Router();

// @route  POST api/users
// @desc   Register user
// @access Public
usersRouter.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password, email } = req.body;

    try {
      let user: any = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      const salt = await bcrypt.genSalt();

      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      let expiresIn: number = 3600;
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn },
        (err: Error | null, token: string | undefined) => {
          if (err) throw err;
          if (token) {
            return res.status(200).json({ token, expiresIn });
          }
          throw "Error generating token";
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.sendStatus(500).json({ msg: err.message || err });
    }
  }
);
