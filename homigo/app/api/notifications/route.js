import Notification from '@/models/notification';
import { connectMongoDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectMongoDB();
    
    const notifications = await Notification.find({ 
      recipient: session.user.id 
    })
    .sort({ createdAt: -1 })
    .populate('sender booking property');

    return Response.json(notifications, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { recipientId, message, type } = await req.json();
    await connectMongoDB();

    const newNotification = await Notification.create({
      recipient: recipientId,
      sender: session.user.id,
      message,
      type: type || 'booking_created',
      read: false
    });

    return Response.json(newNotification, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { notificationId } = await req.json();
    await connectMongoDB();

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    return Response.json(updatedNotification, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}