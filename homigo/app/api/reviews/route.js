import { connectMongoDB } from "@/lib/mongodb";
import Review from "@/models/reviews";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET: Fetch all reviews
export async function GET() {
  try {
    await connectMongoDB();

    const reviews = await Review.find()
      .populate('user', 'name profilePic')
      .populate('property', 'image')
      .sort({ createdAt: -1 });
      

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error in reviews GET:", error);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Create a new review for the authenticated user
export async function POST(req) {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const data = await req.json();
    const { property, ratingLister, ratingProperty, text } = data;

    if (!property || !ratingLister || !ratingProperty) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (typeof ratingLister !== "number" || ratingLister < 1 || ratingLister > 5) {
      return NextResponse.json({ message: "Invalid Lister rating value" }, { status: 400 });
    }

    if (typeof ratingProperty !== "number" || ratingProperty < 1 || ratingProperty > 5) {
      return NextResponse.json({ message: "Invalid Property rating value" }, { status: 400 });
    }

    if (text && typeof text !== "string") {
      return NextResponse.json({ message: "Invalid text format" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newReview = new Review({
      user: user._id,
      property,
      ratingLister,
      ratingProperty,
      text,
    });

    await newReview.save();
    await newReview.populate("user", "name");
    await newReview.populate("property", "title");

    return NextResponse.json({
      message: "Review submitted successfully",
      review: newReview.toJSON(),
    });
  } catch (error) {
    console.error("Error in reviews POST:", error);
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
  }
}