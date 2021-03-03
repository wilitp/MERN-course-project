import { model, Schema, Document } from "mongoose";

const required = true;

const UserSchema = new Schema({
  name: {
    type: String,
    required,
  },
  email: {
    type: String,
    required,
    unique: true,
  },
  password: {
    type: String,
    required,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  date: Date;
}

const User = model<UserDoc>("user", UserSchema);

export default User;
