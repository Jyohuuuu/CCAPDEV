import { connectMongoDB } from "@/lib/mongodb";
import Booking from "@/models/booking";
import User from "@/models/user";
import Property from "@/models/property";
import Notification from '@/models/notification';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    
    await connectMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    
    let bookings = [];
    
    if (type === "received") {
      
      const userProperties = await Property.find({ lister: user._id });
      
      if (userProperties.length > 0) {
        
        const propertyIds = userProperties.map(property => property._id);
      
        bookings = await Booking.find({ 
          propertyId: { $in: propertyIds } 
        })
        .populate('propertyId', 'title location image price description')
        .populate('userId', 'name email profilePic')
        .sort({ createdAt: -1 });
      }
    } else {
      
      bookings = await Booking.find({ userId: user._id })
        .populate('propertyId', 'title location image price description')
        .sort({ createdAt: -1 });
    }
    
    return NextResponse.json({ bookings });
    
  } catch (error) {
    console.error("Error in bookings GET:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings" }, 
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    
    await connectMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const data = await req.json();
    const { 
      startDate, 
      endDate, 
      guestCount, 
      propertyId, 
      paymentMethod,
      totalPrice 
    } = data;
    
    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    
    // Check for date availability (prevent double bookings)
    const overlappingBookings = await Booking.find({
      propertyId,
      $or: [
        { 
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ],
      status: { $ne: 'cancelled' }
    });
    
    if (overlappingBookings.length > 0) {
      return NextResponse.json({ 
        message: "Selected dates are not available for this property" 
      }, { status: 400 });
    }
    
    // Create new booking
    const newBooking = new Booking({
      userId: user._id,
      propertyId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guestCount,
      paymentMethod,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date()
    });
    
    await newBooking.save();
    
    // Add dates to property's unavailable dates - NEW CODE
    const dateArray = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Update property with new unavailable dates
    await Property.findByIdAndUpdate(
      propertyId,
      { $push: { unavailableDates: { $each: dateArray } } }
    );

    const propertyWithHost = await Property.findById(propertyId).populate('lister');
    await Notification.create({
      recipient: propertyWithHost.lister._id,
      sender: user._id,
      booking: newBooking._id,
      property: propertyId,
      message: `New booking for ${propertyWithHost.title}! (${guestCount} guests, ${startDate} to ${endDate})`,
      type: 'booking_created',
    });

    return NextResponse.json({
      message: "Booking created successfully",
      booking: newBooking
    });
    
  } catch (error) {
    console.error("Error in bookings POST:", error);
    return NextResponse.json(
      { message: "Failed to create booking" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
    }

    await connectMongoDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const property = await Property.findById(booking.propertyId);
    if (property) {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      await Property.updateOne(
        { _id: property._id },
        {
          $pull: {
            unavailableDates: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        }
      );
    }

    await Booking.findByIdAndDelete(bookingId);

    return NextResponse.json({ message: "Booking deleted successfully" });

  } catch (error) {
    console.error("Error in booking DELETE:", error);
    return NextResponse.json(
      { message: "Failed to delete booking", error: error.message },
      { status: 500 }
    );
  }
}

