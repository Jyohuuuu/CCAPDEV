import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectMongoDB();
  const url = new URL(req.url);
  
  console.log('Full request URL:', req.url);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.warn('No session user ID - returning all properties');
  }

  const params = {
    userId: url.searchParams.get('userId'),
    excludeMine: url.searchParams.get('excludeMine') === 'true',
    name: url.searchParams.get('name') || '',
    location: url.searchParams.get('location') || '',
    minPrice: url.searchParams.get('minPrice'),
    maxPrice: url.searchParams.get('maxPrice'),
    currentUserId: session?.user?.id
  };

  console.log('Processed params:', params);

  let query = {};

  if (params.userId) {
    query.lister = params.userId;
    console.log(`Filtering by USER ID: ${params.userId}`);
  } else if (params.excludeMine && params.currentUserId) {
    query.lister = { $ne: params.currentUserId };
    console.log(`Excluding USER ID: ${params.currentUserId}`);
  } else {
    console.log('No user filter applied');
  }


  console.log('Final query to execute:', JSON.stringify(query));

  try {
    const properties = await Property.find(query)
      .populate('lister', '_id name')
      .lean();

    if (params.currentUserId) {
      const myProperties = properties.filter(p => 
        p.lister?._id.toString() === params.currentUserId
      );
      console.log(`Found ${myProperties.length} properties belonging to current user`);
    }

    return new Response(JSON.stringify({ properties }));
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch properties' }),
      { status: 500 }
    );
  }
}