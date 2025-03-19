"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <>
      {/* header */}
      <div className="relative bg-white p-9 border-b-2 border-gray-300">
        <header>
          <div className="absolute top-2 left-5 flex items-center">
            <Image 
              src="/Images/TempLogo.png" 
              alt="Homigo Logo" 
              width={50} 
              height={50} 
            />
            <Link href="/dashboard" className="text-black text-xl font-semibold ml-2">
              HOMIGO
            </Link>
          </div>

          {/* dropdown menu */}
          <div className="absolute top-4 right-5 flex items-center">
            <div className="relative" ref={menuRef}>
              {menuOpen && (
                <div className="absolute right-0 mt-6 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/user-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Log Out
                  </button>
                </div>
              )}
            
              <div className="flex h-9 bg-white shadow-md rounded-full overflow-hidden">
                {/* menu button */}
                <div className="flex items-center justify-center px-3 cursor-pointer" onClick={toggleMenu}>
                  <span className="text-lg">&#9776;</span>
                </div>

                {/* profile image */}
                <div className="w-9 flex items-center justify-center">
                  <Image 
                    src={session?.user?.image || "/Images/defaultUser.png"} 
                    alt="User" 
                    width={25} 
                    height={25} 
                    className="rounded-full"
                  />
                </div>

              </div>

            </div>
          </div>
        </header>
      </div>
      
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
                <span className="font-bold text-lg">★ 5.0 <span className="text-gray-500 font-normal">(5 reviews)</span></span>
                <p className="text-sm font-medium">Host</p>
              </div>
              <hr className="border-t-2 border-gray-200 my-3" />
              <button className="w-60 bg-black text-white py-2 px-10 rounded-md mt-55 hover:scale-105 transition-transform">
                Message
              </button>
            </div>
          </div>

          {/* user info grid */}
          <div className="md:col-span-2 space-y-10 mt-12">
            {/* basic user info */}
            <div className="text-center md:text-left">
              <h1 className="text-6xl font-semibold">{session?.user?.name}</h1>
              <p className="text-gray-500 text-sm mt-2">Quezon City - Joined February 2024</p>
              <p className="text-gray-500 text-sm md:max-w-lg mt-3 leading-relaxed">
                Hi! I'm Kian, currently a student in De Lasalle University. I'm a host in Homigo and I'm looking forward to meeting new people and hosting them in my place!
              </p>
            </div>
            
            {/* properties */}
            <div>
              {/* gets only the first name */}
              <h2 className="text-2xl mb-4 font-semibold">
                {session?.user?.name?.split(' ')[0]}'s Properties
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
                    <span className="text-lg font-bold">Cozy Modern House 1 <span className="ml-20 text-black-500 font-light">★ 5.0</span></span>
                    <p className="text-gray-500 text-sm mt-1">Quezon City</p>
                    <p className="text-lg font-bold">₱ 5000 <span className="text-gray-500 text-[13px] font-light">/night</span></p>
                  </div>
                </div>

              </div>
            </div>
            
            {/* reviews */}
            <div>
              <h2 className="text-2xl mb-4">Reviews</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((guest, index) => (
                  <div key={index} className="flex items-center bg-white p-4 border-2 border-gray-300 rounded-lg shadow-md">
                    <Image 
                      src="/Images/defaultUser.png" 
                      alt={`Guest ${guest}`} 
                      width={35} 
                      height={35} 
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold">Guest {guest}</h3>
                      <span className="text-gray-600 text-sm">★★★★★ <span className="ml-1">• {['March', 'April', 'May'][index]} 2024</span></span>
                      <p className="text-gray-500 text-sm mt-1">Amazing host! The place was exactly as described, very clean and in a great location.</p>
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