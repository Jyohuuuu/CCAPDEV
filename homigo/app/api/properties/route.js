import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const excludeMine = url.searchParams.get("excludeMine") === "true";

  let query = {};

  if (excludeMine) {
    query = { lister: { $ne: userId } }; // Show others' listings
  } else if (userId) {
    query = { lister: userId }; // Show only my listings
  }

  try {
    const properties = await Property.find(query)
    .populate("lister", "name")
    .sort({ createdAt: -1 });


    return new Response(JSON.stringify({ properties }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch properties" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await connectMongoDB();

  try {
    const body = await req.json();

    const { title, location, pricepernight, description, image, lister } = body;

    if (!lister || !title || !location || !pricepernight || !description) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const property = await Property.create({
      title,
      location,
      pricepernight,
      description,
      image,
      lister,
    });

    return new Response(JSON.stringify(property), { status: 201 });
  } catch (err) {
    console.error("POST /api/properties error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}