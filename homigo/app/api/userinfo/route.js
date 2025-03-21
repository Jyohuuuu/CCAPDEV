import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
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
    
    // All data now comes directly from the user model
    return NextResponse.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      city: user.city || "",
      preferredNickname: user.preferredNickname || "",
      bio: user.bio || "",
      createdAt: user.createdAt,
      role: user.role
    });
    
  } catch (error) {
    console.error("Error in userinfo GET:", error);
    return NextResponse.json(
      { message: "Failed to fetch user information" }, 
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
    
    const data = await req.json();
    const { name, email, city, preferredNickname, bio } = data;
    
    await connectMongoDB();
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Create an object with all the fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (city !== undefined) updateFields.city = city;
    if (preferredNickname !== undefined) updateFields.preferredNickname = preferredNickname;
    if (bio !== undefined) updateFields.bio = bio;
    
    // Update all fields directly in the User model
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateFields,
      { new: true } // This returns the updated document
    );
    
    return NextResponse.json({
      message: "Profile updated successfully",
      userInfo: {
        name: updatedUser.name,
        email: updatedUser.email,
        city: updatedUser.city || "",
        preferredNickname: updatedUser.preferredNickname || "",
        bio: updatedUser.bio || ""
      }
    });
    
  } catch (error) {
    console.error("Error in userinfo POST:", error);
    return NextResponse.json(
      { message: "Failed to update profile" }, 
      { status: 500 }
    );
  }
}