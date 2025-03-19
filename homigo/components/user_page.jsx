"use client";

import { useSession } from "next-auth/react";
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
                <div className="absolute right-13 mt-6 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/user-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              )}
            
              <div className="flex h-9 bg-white shadow-md rounded-full overflow-hidden">
                {/*menu button*/}
                <div className="flex items-center justify-center px-3 cursor-pointer" onClick={toggleMenu}>
                  <span className="text-lg">&#9776;</span>
                </div>
                
                {/* profile image*/}
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

      {/* profile card */}
      <div className="mt-5 flex flex-col items-center">
        <div className="w-64 min-h-[500px] border-2 border-gray-300 rounded-lg p-5 text-center shadow-md relative">
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
          <button className="bg-black text-white py-2 px-10 rounded-md mt-3 hover:scale-105 transition-transform">
            Message
          </button>
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-4xl font-semibold">{session?.user?.name}</h1>
          <p className="text-gray-500 text-sm mt-2">Quezon City - Joined February 2024</p>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mt-3 leading-relaxed">
            Hi! I'm Kian, currently a student in De Lasalle University. I'm a host in Homigo and I'm looking forward to meeting new people and hosting them in my place!
          </p>
        </div>
      </div>

      {/* properties */}
      <div className="mt-10">
        <h2 className="text-2xl">{session?.user?.name}'s Properties</h2>
        <div className="w-[340px] h-[295px] border-2 border-gray-300 rounded-lg overflow-hidden mt-3 shadow-md hover:scale-105 transition-transform">
          <Image 
            src="/Images/sampleHouse1.png" 
            alt="Property" 
            width={340} 
            height={189} 
            className="w-full h-2/3 object-cover"
          />
          <div className="p-3">
            <span className="text-lg font-bold">Cozy Modern House 1 <span className="text-gray-500 font-light">★ 5.0</span></span>
            <p className="text-gray-500 text-sm mt-1">Quezon City</p>
            <p className="text-lg font-bold">₱ 5000 <span className="text-gray-500 text-sm">/night</span></p>
          </div>
        </div>
      </div>

      {/* reviews */}
      <div className="mt-10">
          <h2 className="text-2xl">Reviews</h2>
          {[1, 2, 3].map((guest, index) => (
            <div key={index} className="flex max-w-2xl h-20 items-center bg-white p-4 border-2 border-gray-300 rounded-lg mt-3 shadow-md">
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



    </>
  );
}
