import express, { Router } from "express";
export const postsRouter = Router();

// @route  GET api/posts
// @desc   Test route
// @access Public
postsRouter.get("/", (req, res) => res.send("Posts route"));
