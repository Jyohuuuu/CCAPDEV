import mongoose, { Schema, models } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    lister: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Property",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    rating: {
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
  },

);

reviewSchema.virtual('userData', {  
    localField: 'user',  
    foreignField: '_id',
    justOne: true
  });

const reviewInfo = models.reviewInfo || mongoose.model("Review", reviewSchema);
export default reviewInfo;
