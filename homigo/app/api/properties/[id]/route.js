import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    
    const propertyId = params.id;
    
    if (!propertyId) {
      return NextResponse.json({ message: "Property ID is required" }, { status: 400 });
    }
    
    const property = await Property.findById(propertyId)
      .populate("lister", "name email");
    
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    
    return NextResponse.json({ property });
    
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { message: "Error fetching property details", error: error.message }, 
      { status: 500 }
    );
  }
}