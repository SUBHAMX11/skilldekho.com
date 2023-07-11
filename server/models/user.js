import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      min: 6,
      max: 48,
      required: true,
    },

    picture: {
      type: String,
      default: "/avatar.png",
    },

    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Instructor", "Admin"],
    },

    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
    passwordResetCode: {
      data: String,
      default: "",
    },
    courses: [{ type: ObjectId, ref: "Course" }],
  },

  { timestamps: true } //save the createdAt and updatedAt
);

export default mongoose.model("User", userSchema);
