import express, { Express } from "express";
import connectDB from "./config/db";
import { usersRouter, authRouter, profileRouter, postsRouter } from "./routes";

const app: Express = express();
app.get("/", (_, res) => {
  res.send("hello there");
});

// Middleware
app.use(express.json());

// Connect db
connectDB();

// Define routes
app.use("/api/users", usersRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
