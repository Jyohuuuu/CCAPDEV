"use client";

import { useState } from "react";
import PropertyCard from "@/components/property_card";
import Header from "./header";
import FilterMenu from "@/components/FilterMenu";

const properties = [
  {
    id: 1,
    title: "Cozy Apartment in the City",
    price: 120,
    location: "New York, NY",
    image: "/images/apartment.jpg",
    description:
      "Located in the heart of the city, within walking distance to restaurants and shops.",
    available: "Available",
    maxGuests: 2,
    rating: 4.5,
  },
  {
    id: 2,
    title: "Beachfront Villa",
    price: 250,
    location: "Miami, FL",
    image: "/images/villa.jpg",
    description:
      "A luxurious villa right on the beach with stunning ocean views and modern amenities.",
    available: "Available",
    maxGuests: 6,
    rating: 4.8,
  },
  {
    id: 3,
    title: "Calm Home",
    price: 180,
    location: "Washington, D.C.",
    image: "/images/home.jpg",
    description:
      "A peaceful home with a private garden, perfect for relaxation near the city center.",
    available: "Booked",
    maxGuests: 4,
    rating: 3.9,
  },
  {
    id: 4,
    title: "Studio Apartment",
    price: 80,
    location: "New York, NY",
    image: "/images/studio.jpg",
    description:
      "A compact and stylish studio apartment close to public transport and local attractions.",
    available: "Booked",
    maxGuests: 2,
    rating: 4.2,
  },
];

export default function PropertyListings() {
  const [filters, setFilters] = useState({
    title: "",
    availability: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    minGuests: "",
    maxGuests: "",
  });

  const filteredProperties = properties.filter((property) => {
    return (
      (filters.title === "" ||
        property.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.availability === "" ||
        property.available === filters.availability) &&
      (filters.minPrice === "" ||
        property.price >= parseFloat(filters.minPrice)) &&
      (filters.maxPrice === "" ||
        property.price <= parseFloat(filters.maxPrice)) &&
      (filters.rating === "" ||
        property.rating >= parseFloat(filters.rating)) &&
      (filters.minGuests === "" ||
        property.maxGuests >= parseInt(filters.minGuests)) &&
      (filters.maxGuests === "" ||
        property.maxGuests <= parseInt(filters.maxGuests))
    );
  });

  return (
    <>
      <Header />
      <div className="p-4">
        {/* Title & Filter Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Property Listings</h1>
          <FilterMenu filters={filters} setFilters={setFilters} />{" "}
          {/* Use FilterMenu */}
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No properties match the filters.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
