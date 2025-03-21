import NextAuth from "next-auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
//export makes it so that the function/etc can be imported into other files
export const authOptions = {
  providers: [
    CredentialsProvider({ //Email/Password Authentication
      name: "credentials",
      credentials: {},
      async authorize(credentials) {//This function validates the user's credentials
        const { email, password } = credentials;
        
        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password); //Compare the hashed password with the password in the database

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", //JSON Web Token
  },
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    
    async jwt({ token, user }) {//Adds id and email to the JWT token when user is authenicated
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    
    async session({ session, token }) {//Essentially does the same to the session object
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, //Secret Key to encrypt session tokens
  pages: {
    signIn: "/",//Go to the root route if the user is not authenticated
  },
};

const handler = NextAuth(authOptions); //Initializes NextAuth.js with the provided authOptions
export { handler as GET, handler as POST }; //Exported as both GET and POST to handle authentication-related HTTP requests.