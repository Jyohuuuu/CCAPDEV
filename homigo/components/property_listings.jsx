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

  const [filter, setFilter] = useState({
    name: "",
    location: "",
    minPrice: "", // Default value as an empty string
    maxPrice: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown visibility

  const propertiesPerPage = 12;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchProperties();
    }
  }, [status, pathname, filter]);

  const fetchProperties = async () => {
    try {
      const queryParams = new URLSearchParams({
        excludeMine: "true",
      }).toString();
  
      const res = await fetch(`/api/properties?${queryParams}`);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
      const data = await res.json();
  
      setProperties(data.properties);
      setHasMore(data.properties.length === propertiesPerPage);
  
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };
  

  // NEW: Added a filter function to check if the property matches filter criteria
  const filterProperties = (property) => {
    const { name, location, minPrice, maxPrice } = filter;
    const lowerCaseName = name.toLowerCase();
    const lowerCaseLocation = location.toLowerCase();

    // NEW: Case-insensitive matching for name and location
    const matchesName = property.title.toLowerCase().includes(lowerCaseName);
    const matchesLocation = property.location
      .toLowerCase()
      .includes(lowerCaseLocation);

    // NEW: Check minPrice and maxPrice more safely
    const matchesMinPrice = minPrice
      ? property.pricepernight >= parseFloat(minPrice)
      : true;
    const matchesMaxPrice = maxPrice
      ? property.pricepernight <= parseFloat(maxPrice)
      : true;

    return matchesName && matchesLocation && matchesMinPrice && matchesMaxPrice; // Return true if property matches filter criteria
  };

  // NEW: Filtered properties before slicing for pagination
  const paginatedProperties = properties
    .filter(filterProperties) // Apply the filter before pagination
    .slice(0, page * propertiesPerPage);

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
    router.push(
      `/booking?propertyId=${selectedProperty._id}&checkIn=${checkInISO}&checkOut=${checkOutISO}`
    );

    closeModal();
  };
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  // Fetch existing reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        
        if (!res.ok) {
          console.error(`Failed to fetch reviews: Status ${res.status}`);
          setError(`Failed to fetch reviews: ${res.statusText}`);
          return;
        }
        
        const data = await res.json();
        console.log("Reviews fetched successfully:", data);
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Could not load reviews. Check the console for details.");
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    console.log("Current properties:", properties);
    console.log("Current reviews:", reviews);
    
    if (properties.length > 0 && reviews.length > 0) {
      const sampleProperty = properties[0];
      console.log("Sample property ID:", sampleProperty._id);
      
      const matchingReviews = reviews.filter(review => {
        const reviewPropertyId = review.property._id ? String(review.property._id) : String(review.property);
        return reviewPropertyId === String(sampleProperty._id);
      });
      
      console.log("Matching reviews for sample property:", matchingReviews);
    }
  }, [properties, reviews]);
  // Function to calculate the average rating of a property
const getAverageRating = (propertyId) => {
  const propertyIdStr = String(propertyId);
  
  const reviewsList = reviews.filter(review => {
    const reviewPropertyId = review.property._id ? String(review.property._id) : String(review.property);
    return reviewPropertyId === propertyIdStr;
  });

  if (reviewsList.length === 0) {
    return "0.0";
  }

  const totalPropertyRating = reviewsList.reduce((sum, review) => sum + review.ratingProperty, 0);
  const avgRatingProperty = totalPropertyRating / reviewsList.length;

  return avgRatingProperty.toFixed(1);
};

const getTotalRating = (propertyId) => {
  const propertyIdStr = String(propertyId);
  
  const reviewsList = reviews.filter(review => {
    const reviewPropertyId = review.property._id ? String(review.property._id) : String(review.property);
    return reviewPropertyId === propertyIdStr;
  });
  
  return reviewsList.length;
};

  const getAverageListerRating = (listerId) => {
    const propertyList = properties.filter(property => property.lister?._id === listerId);

    if (propertyList.length === 0) {
      return "0.0";
    }
  
    // Extract property IDs
    const propertyIds = propertyList.map(property => property._id);
  
    // Filter reviews based on property IDs
    const relevantReviews = reviews.filter(review => propertyIds.includes(review.property.toString()));
  
    if (relevantReviews.length === 0) {
      return "0.0";
    }
  
    // Calculate the average ratingLister
    const totalRatingLister = relevantReviews.reduce((sum, review) => sum + review.ratingLister, 0);
    const avgRatingLister = (totalRatingLister / relevantReviews.length).toFixed(1); // Format to one decimal place
  

    return avgRatingLister;
  };

  const getTotalListerRating = (listerId) => {
    const propertyList = properties.filter(property => property.lister?._id === listerId);

    if (propertyList.length === 0) {
      return "0.0";
    }
    const propertyIds = propertyList.map(property => property._id);

    const total = reviews.filter(review => propertyIds.includes(review.property.toString()));

    return total.length;
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {pathname === "/mylistings"
              ? "Manage Your Listings"
              : "All Properties"}
          </h1>

          {/* Filter button */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-600 transition"
          >
            Filter
          </button>
        </div>

        {/* Filter dropdown */}
        {isDropdownOpen && (
          <div className="relative z-10">
            {" "}
            {/* z-10 ensures dropdown is above other elements */}
            <div className="absolute right-0 mt-0 bg-white border border-gray-300 rounded-lg shadow-lg w-108 p-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Property Name
                </label>
                <input
                  type="text"
                  className="w-32 border border-gray-300 rounded px-2 py-1"
                  value={filter.name}
                  onChange={(e) =>
                    setFilter({ ...filter, name: e.target.value })
                  }
                />
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  className="w-32 border border-gray-300 rounded px-2 py-1"
                  value={filter.location}
                  onChange={(e) =>
                    setFilter({ ...filter, location: e.target.value })
                  }
                />
                <label className="block text-sm font-medium">Min Price</label>
                <input
                  type="number"
                  className="w-32 border border-gray-300 rounded px-2 py-1"
                  value={filter.minPrice || ""}
                  onChange={(e) =>
                    setFilter({ ...filter, minPrice: e.target.value })
                  }
                />
                <label className="block text-sm font-medium">Max Price</label>
                <input
                  type="number"
                  className="w-32 border border-gray-300 rounded px-2 py-1"
                  value={filter.maxPrice || ""}
                  onChange={(e) =>
                    setFilter({ ...filter, maxPrice: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {properties.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProperties.map((property) => (
              <div
                key={property._id}
                onClick={() => openModal(property)}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm transition hover:shadow-lg cursor-pointer">

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
                <h3 className="text-lg font-semibold">{property.title} 
              <span className={`text-xl ${getAverageRating(property._id) !== '0.0' ? "text-yellow-400" : "text-gray-400"}`}> ★</span>
            <span style={{ fontSize: '0.8em' }}>{getAverageRating(property._id)} ({getTotalRating(property._id)})</span>
            </h3>
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
            <h2 className="text-lg font-semibold">
              {selectedProperty.title} 
              <span className={`text-xl ${getAverageRating(selectedProperty._id) !== '0.0' ? "text-yellow-400" : "text-gray-400"}`}> ★</span>
              <span style={{ fontSize: '0.8em' }}>{getAverageRating(selectedProperty._id)} ({getTotalRating(selectedProperty._id)})</span>
            </h2>
            <p className="text-gray-600 mb-4">{selectedProperty.description}</p>

            <div className="flex items-center">
                    <p className="text-sm font-medium mr-2">By:</p>
                    <div className="flex items-center">
                      <img 
                        src={selectedProperty.lister?.profilePic || "/defaultUser.png"} 
                        alt={selectedProperty.title || "Property"}
                        className="w-6 h-6 rounded-full mr-2 object-cover border-1 border-gray-300"
                        onError={(e) => {
                          console.log("Image failed to load, using fallback.");
                          e.target.src = "/defaultUser.png";
                        }}
                      />
                      <span className="text-sm">{selectedProperty.lister?.name || "Name"}</span>
                      <span className={`text-xl ${getAverageListerRating(selectedProperty.lister?._id) !== '0.0' ? "text-yellow-400" : "text-gray-400"}`} > ★</span>
  <span style={{ fontSize: '0.8em' }}>{getAverageListerRating(selectedProperty.lister?._id)} ({getTotalListerRating(selectedProperty.lister?._id)})</span>
                    </div>
          </div>

            <p className="text-lg font-semibold text-blue-600 mb-6">
              ₱{selectedProperty.pricepernight} per night
            </p>
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium">Check-in</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <label className="block text-sm font-medium">Check-out</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
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
