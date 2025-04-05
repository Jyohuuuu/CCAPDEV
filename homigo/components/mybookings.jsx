"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "./header";
import Link from "next/link";

export default function MyBookingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/booking');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) {
      return;
    }
  
    try {
      const response = await fetch(`/api/booking?bookingId=${bookingId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
  
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking. Please try again.");
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header />

      {/*cards for properties that I'VE booked*/}
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">Properties Booked</h1>

        {loading ? (
          <div className="flex justify-center">
            <p className="text-xl">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 bg-gray-100 rounded-md">
            <h3 className="text-xl font-medium mb-2">No bookings found</h3>
            <Link 
              href="/listings"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Find properties to book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img 
                    src={booking.propertyId?.image || "/default-image.jpg"} 
                    alt={booking.propertyId?.title || "Property"}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      {booking.propertyId?.title || "Property"}
                    </h3>

                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="text-gray-500 hover:text-red-500 transition"
                      title="Delete booking"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">Location:</span> {booking.propertyId?.location || "N/A"}
                  </p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm">
                      <span className="font-medium">Check-in:</span> {formatDate(booking.startDate)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Check-out:</span> {formatDate(booking.endDate)}
                    </p>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Status:</p>
                      <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm font-medium">Total:</p>
                      <p className="text-sm font-bold">₱{booking.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* cards for my properties that have been booked */}
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">My Booked Properties</h1>

        {loading ? (
          <div className="flex justify-center">
            <p className="text-xl">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 bg-gray-100 rounded-md">
            <h3 className="text-xl font-medium mb-2">No bookings found</h3>
            <Link 
              href="/listings"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              List your properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img 
                    src={booking.propertyId?.image || "/default-image.jpg"} 
                    alt={booking.propertyId?.title || "Property"}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      {booking.propertyId?.title || "Property"}
                    </h3>

                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="text-gray-500 hover:text-red-500 transition"
                      title="Delete booking"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">Location:</span> {booking.propertyId?.location || "N/A"}
                  </p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm">
                      <span className="font-medium">Check-in:</span> {formatDate(booking.startDate)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Check-out:</span> {formatDate(booking.endDate)}
                    </p>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Status:</p>
                      <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm font-medium">Total:</p>
                      <p className="text-sm font-bold">₱{booking.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}