import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectMongoDB();
  const url = new URL(req.url);
  const session = await getServerSession(authOptions);
  
  // Debug: Log all incoming parameters
  console.log('Raw query params:', Object.fromEntries(url.searchParams));

  const currentUserId = session?.user?.id;
  const requestedUserId = url.searchParams.get('userId');
  const excludeMine = url.searchParams.get('excludeMine') === 'true';

  // Convert to ObjectId once
  const currentUserObjectId = currentUserId 
    ? new mongoose.Types.ObjectId(currentUserId)
    : null;

  let query = {};

  if (requestedUserId) {
    query.lister = new mongoose.Types.ObjectId(requestedUserId);
    console.log(`Filtering by USER ID: ${requestedUserId}`);
  } else if (excludeMine && currentUserObjectId) {
    query.lister = { $ne: currentUserObjectId };
    console.log(`Excluding CURRENT USER ID: ${currentUserId}`);
  } else {
    console.log('No user filter applied');
  }

  console.log('Final MongoDB query:', JSON.stringify(query));

  try {
    const properties = await Property.find(query)
      .populate('lister', '_id name')
      .lean();

    const myProperties = properties.filter(p => 
      p.lister?._id?.toString() === currentUserId
    );
    console.log(
      `Results: ${properties.length} total, ` +
      `${myProperties.length} MINE (should be 0 when excludeMine=true)`
    );

    return new Response(JSON.stringify({ properties }));
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch properties' }),
      { status: 500 }
    );
  }
}