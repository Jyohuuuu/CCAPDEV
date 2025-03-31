"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "../components/header";

export default function PropertyListPage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const propertiesPerPage = 12;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchProperties();
    }
  }, [status, pathname]);

  const fetchProperties = async () => {
    try {
      const res = await fetch(
        `/api/properties?userId=${session.user.id}&excludeMine=${
          pathname === "/listings"
        }`
      );
      const data = await res.json();
      setProperties(data.properties);
      setHasMore(data.properties.length > propertiesPerPage);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const paginatedProperties = properties.slice(0, page * propertiesPerPage);

  const openModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
    setCheckIn("");
    setCheckOut("");
  };

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }
    
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      alert("Check-in date cannot be in the past.");
      return;
    }
    
    if (endDate <= startDate) {
      alert("Check-out date must be after check-in date.");
      return;
    }
    
    // Convert dates to ISO strings for URL parameters
    const checkInISO = encodeURIComponent(startDate.toISOString());
    const checkOutISO = encodeURIComponent(endDate.toISOString());
    
    // Navigate to booking page with query parameters
    router.push(`/booking?propertyId=${selectedProperty._id}&checkIn=${checkInISO}&checkOut=${checkOutISO}`);
    
    closeModal();
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          {pathname === "/mylistings"
            ? "Manage Your Listings"
            : "All Properties"}
        </h1>

        {properties.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProperties.map((property) => (
              <div
                key={property._id}
                onClick={() => openModal(property)}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm transition hover:shadow-lg cursor-pointer"
              >
                <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={
                      property.image || "https://via.placeholder.com/400x300"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                    {property.description}
                  </p>
                  <div className="text-sm text-gray-600 flex justify-between items-center">
                    <span>{property.location}</span>
                    <span className="font-medium">
                      ₱{property.pricepernight}/night
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No properties found.
          </p>
        )}

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <img
              src={
                selectedProperty.image || "https://via.placeholder.com/400x300"
              }
              alt={selectedProperty.title}
              className="rounded-lg mb-4 h-48 w-full object-cover"
            />
            <h2 className="text-xl font-bold mb-2">{selectedProperty.title}</h2>
            <p className="text-gray-600 mb-4">{selectedProperty.description}</p>
            <p className="text-gray-400 mb-2">by: {selectedProperty.lister?.name}</p>
            <p className="text-lg font-semibold text-blue-600 mb-6">
              ₱{selectedProperty.pricepernight} per night
            </p>
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium">Check-in</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <label className="block text-sm font-medium">Check-out</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <button
              onClick={handleReserve}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Reserve
            </button>
          </div>
        </div>
      )}
    </>
  );
}
