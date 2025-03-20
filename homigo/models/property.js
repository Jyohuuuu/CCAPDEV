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
    availability: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
    bookstart: {
      type: Date,
      default: null,
    },
    bookend: {
      type: Date,
      default: null,
    },
    currentguests: {
      type: Number,
      default: 0,
    },
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
