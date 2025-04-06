"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (session?.user?.id) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch('/api/notifications');
          const data = await res.json();
          setNotifications(Array.isArray(data) ? data : []);
          setUnreadCount(
            Array.isArray(data) 
              ? data.filter(n => n && n.read === false).length 
              : 0
          );
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [session]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });
      
      setNotifications(notifications.map(n => 
        n._id === notificationId ? {...n, read: true} : n
      ));
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-white p-9 border-b-2 border-gray-300">
      <header>
        <div className="absolute top-2 left-5 flex items-center">
          <img
            src="/TempLogo.png"
            alt="Homigo Logo"
            width={50}
            height={50}
          />
          <Link
            href="/userpage"
            className="text-black text-xl font-semibold ml-2"
          >
            HOMIGO
          </Link>
        </div>

        {pathname !== "/listings" && (
          <div className="absolute top-4 right-[150px] flex items-center gap-4">

            <Link href="/mybookings">
              <button 
                className="px-8 py-2 bg-black text-white rounded hover:bg-gray-600 transition">
                My Bookings
              </button>
            </Link>

            <Link href="/listings">
              <button className="px-8 py-2 bg-black text-white rounded hover:bg-gray-600 transition">
                Browse
              </button>
            </Link>
            
            {/* Notifications Bell */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 max-h-80 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification._id}
                        className={`px-4 py-2 text-sm border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.read ? 'text-gray-500' : 'font-medium text-gray-900'}`}
                        onClick={() => {
                          markAsRead(notification._id);
                        }}
                      >
                        <div>{notification.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-500 text-center">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/*Dropdown Menu */}
        <div className="absolute top-4 right-5 flex items-center">
          <div className="relative" ref={menuRef}>
            {menuOpen && (
              <div className="absolute right-0 mt-6 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/userpage"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/mylistings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >MyListings</Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  About
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}

            <div className="flex h-9 bg-white shadow-md rounded-full overflow-hidden">
              <div
                className="flex items-center justify-center px-3 cursor-pointer"
                onClick={toggleMenu}
              >
                <span className="text-lg">&#9776;</span>
              </div>
              <div className="w-9 flex items-center justify-center">
                <img
                  src={session?.user?.image || "/defaultUser.png"}
                  alt="User"
                  width={25}
                  height={25}
                  className="rounded-full mx-auto object-cover border-1 border-gray-300"
                  style={{ width: '25px', height: '25px' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/defaultUser.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
