"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Header from "./header";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [hasNickname, setHasNickname] = useState(false);
  
  // demo stuff
  const mockUserData = {
    fullName: session?.user?.name || "Kian Carl Daylag",
    city: "Quezon City",
    nickname: "",
    email: session?.user?.email || "user@example.com",
    bio: "Hi! I'm currently a student in De Lasalle University. I'm a host in Homigo and I'm looking forward to meeting new people and hosting them in my place!"
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* left block */}
          <div className="md:col-span-1">
            <div className="w-full min-h-[500px] border-2 border-gray-300 rounded-lg p-5 text-center shadow-md mx-auto">
              <div className="relative mx-auto w-40 h-40 mb-4">
                <Image
                  src={session?.user?.image || "/Images/defaultUser.png"}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto"
                />

                {/* little edit icon from svg, https://icons.getbootstrap.com/icons/pencil-square/*/}
                <button className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 shadow-md hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                  </svg>
                </button>

              </div>
              <h2 className="text-xl font-semibold mb-2">{session?.user?.name}</h2>
              <p className="text-gray-500 text-sm">Profile Settings</p>
              <hr className="border-t-2 border-gray-200 my-4" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">Account Settings</h3>
                <ul className="space-y-2 text-sm">
                  <li className="py-1 px-2 bg-gray-100 rounded">Profile Information</li>
                </ul>
              </div>
            </div>
          </div>

            {/* right block */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 border-2 border-gray-300 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-6 border-b pb-3">Profile Information</h1>
              
              {/* settings to change */}
              <div className="space-y-6">
                {/* full name */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Full Name</h3>
                    <p className="text-gray-700">{mockUserData.fullName}</p>
                  </div>
                  <button className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                    Edit
                  </button>
                </div>

                {/* city edit */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-semibold">City</h3>
                    <p className="text-gray-700">{mockUserData.city}</p>
                  </div>
                  <button className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                    Edit
                  </button>
                </div>
                
                {/* pref nickname */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Preferred Nickname</h3>
                    <p className="text-gray-700">
                      {hasNickname ? mockUserData.nickname : "Add a preferred name for hosts to call you"}
                    </p>
                  </div>
                  <button className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                    {hasNickname ? "Edit" : "Add"}
                  </button>
                </div>
                
                {/* email address */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Email Address</h3>
                    <p className="text-gray-700">{mockUserData.email}</p>
                  </div>
                  <button className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                    Edit
                  </button>
                </div>
                
                {/* bio */}
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="md:w-2/3">
                    <h3 className="font-semibold">Bio</h3>
                    <p className="text-gray-700">{mockUserData.bio}</p>
                  </div>
                  <button className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                    Edit
                  </button>
                </div>
                </div> 

              {/* Save Button */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}