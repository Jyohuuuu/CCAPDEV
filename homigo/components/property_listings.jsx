"use client";

import { useState, useEffect } from "react";
import Header from "./header";
import PropertyCard from "./property_card";
import FilterMenu from "./filtermenu";

export default function PropertyListings() {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    availability: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    minGuests: "",
    maxGuests: "",
  });

  useEffect(() => {
    let ignore = false;
    const fetchProperties = async () => {
      console.log("Fetching properties from API...");
      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          page: 1, // ✅ Always reset to page 1 when filters change
          limit: 12,
        });

        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        console.log("Fetching with filters:", queryParams.toString());

        const res = await fetch(`/api/properties?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch properties");

        const data = await res.json();
        console.log("API response:", data);

        if (!data || !Array.isArray(data.properties)) {
          throw new Error("Invalid response from server");
        }

        if (!ignore) {
          setProperties(data.properties); // ✅ Reset property list
          setHasMore(data.properties.length === 12);
          setPage(1); // ✅ Reset pagination
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    return () => {
      ignore = true;
    };
  }, [filters]); // ✅ Runs only when filters change

  // ✅ Handle Pagination Separately
  useEffect(() => {
    if (page === 1) return; // ✅ Avoid duplicate fetch on filter change

    let ignore = false;
    const fetchMoreProperties = async () => {
      console.log("Fetching more properties...");
      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          page,
          limit: 12,
        });

        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const res = await fetch(`/api/properties?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch properties");

        const data = await res.json();
        console.log("API response (pagination):", data);

        if (!data || !Array.isArray(data.properties)) {
          throw new Error("Invalid response from server");
        }

        if (!ignore) {
          setProperties((prev) => [...prev, ...data.properties]); // ✅ Append new results
          setHasMore(data.properties.length === 12);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreProperties();
    return () => {
      ignore = true;
    };
  }, [page]); // ✅ Runs only when page changes

  return (
    <>
      <Header />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Property Listings</h1>
          <FilterMenu
            filters={filters}
            setFilters={setFilters}
            setPage={setPage}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {properties.length > 0 ? (
            properties.map((property) => {
              console.log("Property ID:", property._id); // Log the ID to check for duplicates
              return <PropertyCard key={property._id} property={property} />;
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No properties found.
            </p>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
