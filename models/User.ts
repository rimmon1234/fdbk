import { Model, Schema, model, models } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  isAuthorized: boolean;
  hasSubmitted: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    isAuthorized: { type: Boolean, default: true },
    hasSubmitted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
  },
  { timestamps: false }
);

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;
