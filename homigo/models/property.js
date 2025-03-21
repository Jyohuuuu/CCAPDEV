import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true, // Ensure an image URL is provided
    },
    propertytitle: {
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
    price: {
      type: Number,
      required: true,
    },
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
    },
  },
  { timestamps: true }
);

const Property =
  mongoose.models.Property ||
  mongoose.model("Property", propertySchema, "propertylistings");

export default Property;
