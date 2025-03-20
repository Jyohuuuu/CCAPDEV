import { connectMongoDB } from "@/lib/mongodb";
import UserInfo from "@/models/userinfo";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // gets the current authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    
    await connectMongoDB();
    
    // finds the email of the user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    

    let userInfo = await UserInfo.findOne({ user: user._id });
    

    if (!userInfo) {
        console.log(`Creating new UserInfo for user: ${user.name} (${user._id})`);
        
        userInfo = new UserInfo({
          user: user._id,  
          city: "",
          preferredNickname: "",
          bio: ""
        });
        
        await userInfo.save();
      }
    

    return NextResponse.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      city: userInfo.city || "",
      preferredNickname: userInfo.preferredNickname || "",
      bio: userInfo.bio || ""
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
    const { city, preferredNickname, bio } = data;
    
    await connectMongoDB();
    
    // finds user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // find & update
    const updatedUserInfo = await UserInfo.findOneAndUpdate(
        { user: user._id }, 
        {
          user: user._id,  
          city,
          preferredNickname,
          bio
        },
        { new: true, upsert: true }
      );
    
    return NextResponse.json({
      message: "Profile updated successfully",
      userInfo: {
        city: updatedUserInfo.city,
        preferredNickname: updatedUserInfo.preferredNickname,
        bio: updatedUserInfo.bio
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