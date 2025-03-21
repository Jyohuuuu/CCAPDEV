import mongoose, { Schema, models } from "mongoose";

const reviewInfoSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
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

reviewInfoSchema.virtual('userData', {  
    localField: 'user',  
    foreignField: '_id',
    justOne: true
  });

const reviewInfo = models.reviewInfo || mongoose.model("reviewInfo", reviewInfoSchema);
export default reviewInfo;
