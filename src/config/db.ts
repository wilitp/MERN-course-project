import m from "mongoose";
import config from "config";

const dbURI = config.get("mongoURI");

const connectDB = async () => {
  try {
    await m.connect(dbURI as any, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Db connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDB;
