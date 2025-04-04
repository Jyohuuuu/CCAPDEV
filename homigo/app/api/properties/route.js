import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectMongoDB();
  
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams);
  console.log('Incoming request with params:', params);

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  console.log('Session user ID:', currentUserId);

  let query = {};

  if (params.userId) {
    query.lister = params.userId;
    console.log('Filtering by specific user ID:', params.userId);
  } else if (params.excludeMine === 'true' && currentUserId) {
    query.lister = { $ne: currentUserId };
    console.log('Excluding current user properties');
  } else {
    console.log('Showing all properties (no user filter)');
  }

  if (params.name) {
    query.title = { $regex: params.name, $options: 'i' };
    console.log('Applying name filter:', params.name);
  }

  if (params.location) {
    query.location = { $regex: params.location, $options: 'i' };
    console.log('Applying location filter:', params.location);
  }

  if (params.minPrice || params.maxPrice) {
    query.pricepernight = {};
    
    if (params.minPrice) {
      query.pricepernight.$gte = parseFloat(params.minPrice);
      console.log('Applying min price:', params.minPrice);
    }
    
    if (params.maxPrice) {
      query.pricepernight.$lte = parseFloat(params.maxPrice);
      console.log('Applying max price:', params.maxPrice);
    }
  }

  console.log('Final MongoDB query:', JSON.stringify(query, null, 2));

  try {
    const properties = await Property.find(query)
      .populate('lister', 'name email profilePic')
      .sort({ createdAt: -1 });

    //Debug
    console.log('Found properties:', properties.length);
    if (properties.length > 0) {
      console.log('Sample property:', {
        _id: properties[0]._id,
        title: properties[0].title,
        lister: properties[0].lister?._id
      });
    }

    return new Response(JSON.stringify({ properties }), { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch properties",
        details: error.message 
      }),
      { status: 500 }
    );
  }
}