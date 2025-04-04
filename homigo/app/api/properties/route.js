import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectMongoDB();
  const url = new URL(req.url);
  
  console.log('\n=== NEW REQUEST ===');
  console.log('Full URL:', url.toString());

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  console.log('Current session user ID:', currentUserId);

  const excludeMine = url.searchParams.get('excludeMine') === 'true';
  const requestedUserId = url.searchParams.get('userId');
  console.log('Request parameters:', { excludeMine, requestedUserId });

  let query = {};

  if (excludeMine && currentUserId) {
    query.lister = { 
      $ne: new mongoose.Types.ObjectId(currentUserId) 
    };
    console.log(`Strictly excluding properties where lister != ${currentUserId}`);
  } 
  else if (requestedUserId) {
    query.lister = new mongoose.Types.ObjectId(requestedUserId);
    console.log(`Showing only properties for user ${requestedUserId}`);
  }
  else {
    console.log('No user filter applied - showing all properties');
  }


  console.log('Final query:', JSON.stringify(query, null, 2));

  try {
    const properties = await Property.find(query)
      .populate('lister', '_id name')
      .lean();

    const myProperties = properties.filter(p => 
      p.lister?._id.toString() === currentUserId
    );
    console.log(`PROPERTIES RETURNED: ${properties.length}`);
    console.log(`MY PROPERTIES FOUND: ${myProperties.length}`);

    return new Response(JSON.stringify({ properties }));
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch properties',
        debug: { currentUserId, excludeMine } 
      }),
      { status: 500 }
    );
  }
}