"use client";

import { useState, useEffect } from "react";
import { useSession,} from "next-auth/react";
import Header from "./header";
import Image from "next/image";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    name: "",
    city: "",
    bio: "",
    preferredNickname: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!session) return;
      
      try {
        const response = await fetch('/api/userinfo');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
      
        console.log("User data from API:", data);
        
        let formattedDate = "Date unavailable";
        try {
          if (data.createdAt) {
            const joinDate = new Date(data.createdAt);
            
            {/*checks if the date is valid before formatting it*/ }
            if (!isNaN(joinDate.getTime())) {
              const month = joinDate.toLocaleString('default', { month: 'long' });
              const year = joinDate.getFullYear();
              formattedDate = `${month} ${year}`;
            }
          }
        } catch (dateError) {
          console.error("Error formatting date:", dateError);
        }
        
        setUserData({
          name: data.name || session?.user?.name || "",
          city: data.city || "No city specified",
          bio: data.bio || "You have not added a bio yet.",
          preferredNickname: data.preferredNickname || "",
          joinedDate: formattedDate,
          role: data.role
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [session]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/*profile card grid*/}
          <div className="md:col-span-1 mt-15">
            <div className=" w-75 min-h-[500px] border-2 border-gray-300 rounded-lg p-5 text-center shadow-md relative mx-auto">
              <Image
                src={session?.user?.image || "/Images/defaultUser.png"}
                alt="Profile"
                width={150}
                height={150}
                className="rounded-full mx-auto"
              />
              <div className="mt-3">
                <span className="font-bold text-lg">
                  ★ 5.0{" "}
                  <span className="text-gray-500 font-normal">(5 reviews)</span>
                </span>
                <p className="text-sm font-medium">{userData.role}</p>
              </div>
              <hr className="border-t-2 border-gray-200 my-3" />
            </div>
          </div>

          {/* user info grid */}
          <div className="md:col-span-2 space-y-10 mt-12">
            {/* basic user info */}
            <div className="text-center md:text-left">
              <h1 className="text-6xl font-semibold">{userData.name}</h1>
              <p className="text-gray-500 text-sm mt-2">
                {userData.city} - Joined {userData.joinedDate}
              </p>
              <p className="text-gray-500 text-sm md:max-w-lg mt-3 leading-relaxed">
                {userData.bio}
              </p>
            </div>

            {/* properties */}
            <div>
              {/* gets only the first name, if and only if there is no specified preferred nickname */}
              <h2 className="text-2xl mb-4 font-semibold">
                {userData.preferredNickname 
                  ? `${userData.preferredNickname}'s Properties` 
                  : `${userData.name.split(" ")[0]}'s Properties`}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* property card */}
                <div className="w-88 h-[295px] border-2 border-gray-300 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform">
                  <Image
                    src="/Images/sampleHouse1.png"
                    alt="Property"
                    width={340}
                    height={189}
                    className="w-full h-2/3 object-cover"
                  />
                  <div className="p-3">
                    <span className="text-lg font-bold">
                      Cozy Modern House 1{" "}
                      <span className="ml-20 text-black-500 font-light">
                        ★ 5.0
                      </span>
                    </span>
                    <p className="text-gray-500 text-sm mt-1">Quezon City</p>
                    <p className="text-lg font-bold">
                      ₱ 5000{" "}
                      <span className="text-gray-500 text-[13px] font-light">
                        /night
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* reviews */}
            <div>
              <h2 className="text-2xl mb-4">Reviews</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((guest, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white p-4 border-2 border-gray-300 rounded-lg shadow-md"
                  >
                    <Image
                      src="/Images/defaultUser.png"
                      alt={`Guest ${guest}`}
                      width={35}
                      height={35}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold">Guest {guest}</h3>
                      <span className="text-gray-600 text-sm">
                        ★★★★★{" "}
                        <span className="ml-1">
                          • {["March", "April", "May"][index]} 2024
                        </span>
                      </span>
                      <p className="text-gray-500 text-sm mt-1">
                        Amazing host! The place was exactly as described, very
                        clean and in a great location.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
