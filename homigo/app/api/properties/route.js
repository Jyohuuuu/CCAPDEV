import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";

// Define the GET request handler
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const availability = searchParams.get("availability");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const title = searchParams.get("title"); // 👈 Get title filter

    const query = {};
    if (availability) query.availability = availability;
    if (minPrice || maxPrice) {
      query.price = {}; // Initialize price filter object
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };

    const minGuests = searchParams.get("minGuests");
    const maxGuests = searchParams.get("maxGuests");

    if (minGuests || maxGuests) {
      query.maxguests = {}; // Ensure this matches your MongoDB field name
      if (minGuests) query.maxguests.$gte = Number(minGuests);
      if (maxGuests) query.maxguests.$lte = Number(maxGuests);
    }

    // 👇 Add title filtering (case-insensitive search)
    if (title) {
      query.propertytitle = { $regex: title, $options: "i" };
    }

    console.log("Query before fetching:", query); // Debugging log

    const properties = await Property.find(query)
      .populate("lister", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(
      "Fetched properties:",
      properties.map((p) => p._id)
    );

    // Additional log to check lister field
    properties.forEach((property) => {
      console.log(
        `Property: ${property.propertytitle}, Lister: ${property.lister?.name}`
      );
    });

    const total = await Property.countDocuments(query);

    console.log("Total documents:", total);
    console.log("Returning response...");

    return NextResponse.json(
      { properties, total, page, limit },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { message: "Error fetching properties", error: error.message },
      { status: 500 }
    );
  }
}

