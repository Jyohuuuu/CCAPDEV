import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  
  const userId = url.searchParams.get("userId");
  const excludeMine = url.searchParams.get("excludeMine") === "true";
  
  let query = {};

  if (userId) {
    query.lister = userId;
  } else if (session?.user?.id) {
    if (excludeMine) {
      query.lister = { $ne: session.user.id };
    }
  }

  const name = url.searchParams.get("name") || "";
  const location = url.searchParams.get("location") || "";
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");

  if (name) {
    query.title = { $regex: name, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (minPrice) {
    query.pricepernight = { $gte: parseFloat(minPrice) };
  }

  if (maxPrice) {
    query.pricepernight = { ...query.pricepernight, $lte: parseFloat(maxPrice) };
  }

  try {
    const properties = await Property.find(query)
      .populate('lister', 'name profilePic')
      .sort({ createdAt: -1 }); 
    return new Response(JSON.stringify({ properties }), { status: 200 });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch properties" }), { status: 500 });
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

    try {
      await User.findByIdAndUpdate(lister, { role: "Host" }, { new: true });
    } catch (updateError) {
      console.error("Failed to update user role:", updateError);
    }

    return new Response(JSON.stringify(property), { status: 201 });
  } catch (err) {
    console.error("POST /api/properties error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Property ID is required" }),
        { status: 400 }
      );
    }

    const property = await Property.findById(id);
    if (!property) {
      return new Response(JSON.stringify({ error: "Property not found" }), {
        status: 404,
      });
    }

    const listerId = property.lister.toString();

    if (listerId !== session.user.id) {
      return new Response(JSON.stringify({ error: "Not authorized" }), {
        status: 403,
      });
    }

    await Property.findByIdAndDelete(id);

    const remainingPropertyCount = await Property.countDocuments({
      lister: listerId,
    });

    if (remainingPropertyCount === 0) {
      await User.findByIdAndUpdate(listerId, { role: "Guest" }, { new: true });
    }

    return new Response(
      JSON.stringify({ message: "Property deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/properties error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
