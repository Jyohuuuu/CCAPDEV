"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Header from "./header";
import Image from "next/image";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
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
        const response = await fetch("/api/userinfo");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        console.log("User data from API:", data);

        let formattedDate = "Date Unavailable";
        try {
          if (data.createdAt) {
            const joinDate = new Date(data.createdAt);

            {
              /*checks if the date is valid before formatting it*/
            }
            if (!isNaN(joinDate.getTime())) {
              const month = joinDate.toLocaleString("default", {
                month: "long",
              });
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
          role: data.role,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [session]);

  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  // Fetch existing reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!session) return;

      try {
        const res = await fetch("/api/reviews");
        if (!res.ok)
          throw new Error(`Failed to fetch reviews: ${res.statusText}`);
        const data = await res.json();

        // Filter reviews to only those made by the current user
        const userReviews = data.filter(
          (review) => review.user?._id === session.user.id
        );

        setReviews(userReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Could not load reviews.");
      }
    };

    fetchReviews();
  }, [session]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/*profile card grid*/}
          <div className="md:col-span-1 mt-15">
            <div className=" w-75 min-h-[500px] border-2 border-gray-300 rounded-lg p-5 text-center shadow-md relative mx-auto">
              <img
                src={session?.user?.image || "/defaultUser.png"}
                alt="Profile"
                width={150}
                height={150}
                className="rounded-full mx-auto object-cover border-2 border-gray-300"
                style={{ width: "150px", height: "150px" }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/defaultUser.png";
                }}
              />
              <div className="mt-3">
                <p className="text-m text-gray-500">{userData.role}</p>
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

            <div>
              {userData.role === "Host" ? (
                <>
                  <div>
                    <h2 className="text-2xl mb-4 font-semibold">
                      {userData.preferredNickname
                        ? `${userData.preferredNickname}'s Properties`
                        : `${userData.name.split(" ")[0]}'s Properties`}
                    </h2>
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-8 text-center">
                      <div className="mb-4">
                        {/* home icon from heroicons https://heroicons.com/outline */}
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Manage your Properties here!
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                        Easily update and organize your property listings. Add
                        new spaces, edit details, and manage your hosting
                        business efficiently.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => router.push("/mylistings")}
                          className="px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                        >
                          Start managing
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* what guests view. */}
                  <div>
                    <h2 className="text-2xl mb-4 font-semibold">Properties</h2>
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-8 text-center">
                      <div className="mb-4">
                        {/* home icon from heroicons https://heroicons.com/outline */}
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Become a Host Today!
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                        Share your space, earn extra income, and connect with
                        travelers from around the world.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => router.push("/mylistings")}
                          className="px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                        >
                          Start hosting
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* reviews */}
            <div>
              <h2 className="text-2xl mb-4">My Reviews</h2>
              <div className="space-y-3">
                <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
                  <div className="space-y-3">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review._id}
                          className="flex items-start bg-white p-4 border-2 border-gray-300 rounded-lg shadow-md w-full"
                        >
                          <img
                            src={review.user?.profilePic || "/defaultUser.png"}
                            alt={"User"}
                            className="w-10 h-10 rounded-full mr-2 object-cover border-1 border-gray-300"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/defaultUser.png";
                            }}
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-start">
                              <div className="max-w-[70%]">
                                <h3 className="text-lg font-semibold">
                                  {review.user?.name || "Anonymous"}
                                </h3>
                                <span className="text-gray-600 text-sm">
                                  Lister Rating:{" "}
                                  {"★"
                                    .repeat(review.ratingLister)
                                    .padEnd(5, "☆")}
                                </span>
                                <br />
                                <span className="text-gray-600 text-sm">
                                  Property Rating:{" "}
                                  {"★"
                                    .repeat(review.ratingProperty)
                                    .padEnd(5, "☆")}
                                </span>
                                <p className="text-gray-700 text-sm mt-1 break-all whitespace-pre-wrap w-full">
                                  {review.text}
                                </p>
                                <span className="text-gray-600 text-sm">
                                  {format(
                                    new Date(review.createdAt),
                                    "MM-dd-yy hh:mm a"
                                  )}
                                </span>
                              </div>
                              <img
                                src={
                                  review.property?.image ||
                                  "/defaultProperty.png"
                                }
                                alt={"Property"}
                                className="w-24 h-24 rounded-lg object-cover border-1 border-gray-300 ml-4"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/defaultProperty.png";
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="mb-4">
                          {/* icon from https://heroicons.com/outline */}
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 text-center">
                          No reviews yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 text-center">
                          After your first stay, reviews (if there is any) will
                          be displayed here.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
