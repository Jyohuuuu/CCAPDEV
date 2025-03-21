"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function MyListings() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const propertiesPerPage = 12;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchProperties();
    }
  }, [status]);

  const fetchProperties = async () => {
    try {
      const res = await fetch(`/api/properties?userId=${session.user.id}`);
      const data = await res.json();
      setProperties(data.properties);
      setHasMore(data.properties.length > propertiesPerPage);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const paginatedProperties = properties.slice(0, page * propertiesPerPage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let propertyData = Object.fromEntries(formData.entries());

    propertyData.pricepernight = Number(propertyData.pricepernight);
    propertyData.lister = session.user.id;

    // Upload to Cloudinary if image is selected
    if (selectedImage) {
      const cloudForm = new FormData();
      cloudForm.append("file", selectedImage);
      cloudForm.append("upload_preset", "apdev_preset"); // <-- Replace
      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dquub7fch/image/upload",
          {
            method: "POST",
            body: cloudForm,
          }
        );
        const data = await res.json();
        if (!data.secure_url) throw new Error("Upload failed");
        propertyData.image = data.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        alert("Image upload failed. Please try again.");
        return;
      }
    } else {
      alert("Please upload an image.");
      return;
    }

    // Post to API
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      if (res.ok) {
        await fetchProperties();
        setModalOpen(false);
        setSelectedImage(null);
      } else {
        const { error } = await res.json();
        alert("Error creating property: " + error);
      }
    } catch (err) {
      console.error("Error creating property:", err);
      alert("Server error. Please try again.");
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Manage Your Listings</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
          >
            + Add Property
          </button>
        </div>

        {properties.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm transition hover:shadow-lg"
              >
                {property.image && (
                  <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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

      {/* Modal for Creating Property */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Property</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                placeholder="Title"
                required
                className="w-full border p-2 rounded-md"
              />
              <input
                name="location"
                placeholder="Location"
                required
                className="w-full border p-2 rounded-md"
              />
              <input
                name="pricepernight"
                type="number"
                placeholder="Price Per Night"
                required
                className="w-full border p-2 rounded-md"
              />
              <textarea
                name="description"
                placeholder="Description"
                required
                className="w-full border p-2 rounded-md resize-none h-24"
              />
              <input
                type="file"
                id="imageUpload"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="imageUpload"
                className="block w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-700 text-center cursor-pointer hover:bg-gray-200"
              >
                {selectedImage ? selectedImage.name : "Choose Photo"}
              </label>

              <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
