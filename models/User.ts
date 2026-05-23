import { Model, Schema, model, models } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  group?: string;
  isAuthorized: boolean;
  hasSubmitted: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  password?: string;
  role: "admin" | "tester";
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    group: { type: String, trim: true },
    isAuthorized: { type: Boolean, default: true },
    hasSubmitted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
    password: { type: String },
    role: { type: String, enum: ["admin", "tester"], default: "tester" },
  },
  { timestamps: false }
);

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;
