import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    lister: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pricepernight: {
      type: Number,
      required: true,
    },
<<<<<<< HEAD
    image: {
      type: String,
      required: true, // Ensure an image URL is provided
    },
    createdAt: {
      type: Date,
      default: Date.now,
=======
    rating: {
      type: Number,
      default: 0,
    },
    max_guests: {
      type: Number,
      required: true,
    },

    cleaningFee: {
      type: Number,
      default: 2500,
    },
    serviceFee: {
      type: Number,
      default: 500,
    },
    rating: {
      type: Number,
      default: 0,
    },
    max_guests: {
      type: Number,
      required: true,
    },
    unavailableDates: [{
      type: Date,
      default: []
    }],
    lister: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
>>>>>>> 572f04a11de3ca36e1b5d159087f3787ffb6c663
    },
  },
);

propertySchema.virtual('userData', {  
    localField: 'user',  
    foreignField: '_id',
    justOne: true
});

const Property =
  mongoose.models.Property ||
  mongoose.model("Property", propertySchema);

export default Property;
