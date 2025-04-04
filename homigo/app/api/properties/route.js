import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  
  const requestedUserId = url.searchParams.get("userId");
  const excludeMine = url.searchParams.get("excludeMine") === "true";
  const currentUserId = session?.user?.id;

  const name = url.searchParams.get("name") || "";
  const location = url.searchParams.get("location") || "";
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");

  let query = {};

  //Handle explicit user requests
  if (requestedUserId) {
    query.lister = requestedUserId;
  } 
  //Handle "exclude mine" case
  else if (excludeMine && currentUserId) {
    query.lister = { $ne: currentUserId };
  }

  // Add search filters
  if (name) {
    query.title = { $regex: name, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Add price filters
  if (minPrice || maxPrice) {
    query.pricepernight = {};
    if (minPrice) query.pricepernight.$gte = parseFloat(minPrice);
    if (maxPrice) query.pricepernight.$lte = parseFloat(maxPrice);
  }

  try {
    const properties = await Property.find(query)
      .populate("lister", "name")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify({ properties }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch properties" }),
      { status: 500 }
    );
  }
}