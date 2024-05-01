import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "This email is already in use"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    image: String,
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
