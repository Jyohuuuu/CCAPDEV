import mongoose, { Schema, models } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    ratingLister: {
      type: Number,
      required: true,
    },
    ratingProperty: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: false,
      maxlength: 100,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const reviewInfo = models.Review || mongoose.model("Review", reviewSchema);
export default reviewInfo;