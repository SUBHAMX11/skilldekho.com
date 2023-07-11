import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 233,
      required: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },

    content: {
      type: {},
      minlength: 126,
    },

    video: {},
    free_preview: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true } //save the createdAt and updatedAt
);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 233,
      required: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },

    description: {
      type: {},
      minlength: 200,
      required: true,
    },
    price: {
      type: Number,
      default: 399,
    },

    image: {},
    category: String,
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
