import mongoose, { Schema, models } from "mongoose";

const userInfoSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true,
          },

        city: {
            type: String,
            required: false,
        },

        preferredNickname: {
            type: String,
            required: false,
        },

        bio: {
            type: String,
            required: false,
        },
    }
);

userInfoSchema.virtual('userData', {  // Changed name to avoid confusion
    ref: 'User',
    localField: 'user',  // 
    foreignField: '_id',
    justOne: true
  });

const UserInfo = models.UserInfo || mongoose.model("UserInfo", userInfoSchema);
export default UserInfo;