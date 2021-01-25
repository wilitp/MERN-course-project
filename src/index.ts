import express, { Express } from "express";

const app: Express = express();

app.get("/", (_, res) => {
  res.send("hello there");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
