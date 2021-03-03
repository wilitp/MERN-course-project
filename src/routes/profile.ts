import express, { Router } from "express";
export const profileRouter = Router();

// @route  GET api/profile
// @desc   Test route
// @access Public
profileRouter.get("/", (req, res) => res.send("Profile route"));
