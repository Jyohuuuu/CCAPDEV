import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./header";

const BookingConfirmation = () => {
  // Existing state
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [guestCount, setGuestCount] = useState(4);
  const [isEditingGuests, setIsEditingGuests] = useState(false);

  // New state for dates
  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2); // Default 2-night stay

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(twoDaysLater);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [dateError, setDateError] = useState("");
  const router = useRouter();

  // Add missing handler for image loading errors
  const handleImageError = (e) => {
    e.target.src = "../defaultUser.png";
    e.target.onerror = null; // Prevents infinite loop
  };

  // Handler for payment method change
  const handlePaymentMethodChange = (method) => {
    if (method !== paymentMethod) {
      setPaymentMethod(method);
    }
  };

  // Handler for guest edits
  const handleGuestEditClick = () => {
    setIsEditingGuests(true);
  };

  const handleGuestCountChange = (newCount) => {
    // Ensure guest count is between 1 and 10
    const validCount = Math.min(Math.max(1, newCount), 10);
    setGuestCount(validCount);
  };

  const handleGuestEditSave = () => {
    setIsEditingGuests(false);
  };

  // Mock data for unavailable dates
  const [unavailableDates, setUnavailableDates] = useState([
    new Date(2025, 1, 18),
    new Date(2025, 1, 19),
    new Date(2025, 1, 20),
    new Date(2025, 2, 1),
    new Date(2025, 2, 2),
  ]);

  // Function to check if a date is unavailable
  const isDateUnavailable = (date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        date.getFullYear() === unavailableDate.getFullYear() &&
        date.getMonth() === unavailableDate.getMonth() &&
        date.getDate() === unavailableDate.getDate()
    );
  };

  // Function to check if date range contains unavailable dates
  const checkDateRangeAvailability = (start, end) => {
    if (!start || !end) return false;

    // Create array of all dates in the range
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check if any date in the range is unavailable
    return dateArray.some((date) => isDateUnavailable(date));
  };
  // Handler for date edit button
  const handleDateEditClick = () => {
    setIsEditingDates(true);
    setDateError("");
  };

  // Handler for date selection
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      if (checkDateRangeAvailability(start, end)) {
        setDateError("Some dates in this range are unavailable.");
      } else {
        setDateError("");
      }
    }
  };

  // Handler for date save
  const handleDateSave = () => {
    if (!dateError) {
      setIsEditingDates(false);
    }
  };

  // Format dates for display
  const formatDate = (date) => {
    if (!date) return "";
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const dateRangeText = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  // Calculate nights
  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // Update price calculations based on nights
  const [priceDetails, setPriceDetails] = useState({
    nightlyRate: 15000,
    nights: 0,
    subtotal: 0,
    cleaningFee: 2500,
    serviceFee: 500,
    total: 0,
  });

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const nightCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setPriceDetails((prev) => ({
        ...prev,
        nights: nightCount,
        subtotal: prev.nightlyRate * nightCount,
        total:
          prev.nightlyRate * nightCount + prev.cleaningFee + prev.serviceFee,
      }));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // Dynamically load the booking_style.css when the component mounts
    const link = document.createElement("style");
    link.type = "text/css";
    link.appendChild(
      document.createTextNode(`
          @font-face {
              font-family: 'Poppins';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }

          @font-face {
              font-family: 'Poppins';
              font-style: normal;
              font-weight: 600;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }

          :root {
              --primary-color: #2a9d8f;
              --secondary-color: #264653;
              --accent-color: #e9c46a;
              --light-gray: #c0c0c0;
              --border-color: #808080;
              --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .booking-page {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              padding-top: 20px !important;
              contain: paint layout;
          }

          body, h1, .date-container, .guest-container, .section-title {
              font-family: 'Poppins', sans-serif;
              margin: 0px;
              padding: 0px;
              position: relative;
          }

          h1 {
              text-align: center;
              margin: 10px auto 30px;
              color: var(--secondary-color);
              font-size: 32px;
              font-weight: 700;
              border: 2px solid var(--border-color);
              border-radius: 12px;
              padding: 12px 25px;
              max-width: 350px;
              box-shadow: var(--shadow);
              position: relative;
              z-index: 1;
          }

          .grid-container {
              display: grid;
              grid-template-columns: minmax(300px, 1fr) minmax(400px, 2fr);
              gap: 40px;
              max-width: 1200px;
              margin: 0 auto 40px;
              padding: 0 20px;
          }

          .your_trip-card {
              padding: 30px;
              max-height: 290px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              margin-bottom: 10px;
              padding-bottom: 5px;
          }

          .date-container + div, .guest-container + div {
              font-weight: bold;
              font-size: 18px;
              color: #333;
          }

          .your_trip-card > div {
              margin-bottom: 10px;
          }

          .trip-item:last-child {
              margin-bottom: 5px;
          }

          .your_trip-card, .property-card, .payment-box, .price-box {
              border-radius: 12px;
              overflow: hidden;
              box-shadow: var(--shadow);
              border: 1px solid var(--border-color);
              contain: content;
          }

          .property-card {
              padding: 30px;
          }

          .date-container, .guest-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 5px;
              margin-bottom: 5px;
          }

          .edit-btn {
              color: var(--primary-color);
              border: 1px solid var(--primary-color);
              padding: 6px 12px;
              border-radius: 20px;
              cursor: pointer;
              font-size: 14px;
              transition: background-color 0.2s ease, color 0.2s ease;
              transform: translateZ(0);
          }

          .section-title {
              font-size: 22px;
              font-weight: 600;
              margin-bottom: 20px;
              color: var(--secondary-color);
              padding-bottom: 10px;
              border-bottom: 2px solid var(--light-gray);
          }

          .property-item {
              display: flex;
              flex-direction: column;
              aspect-ratio: 16/9;
          }

          .property-item img {
              width: 100%;
              height: 250px;
              object-fit: cover;
              content-visibility: auto;
          }

          .property-details {
              padding: 25px;
          }

          .property-details h3 {
              font-size: 24px;
              margin-top: 0;
              margin-bottom: 15px;
              color: var(--secondary-color);
          }

          .property-details p {
              color: #666;
              margin-bottom: 0;
          }

          .payment-container {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 200px;
              max-width: 1200px;
              margin: 0 auto 40px;
              padding: 0 20px;
          }

          .payment-box {
              max-width: 100%;
              margin: 0;
              padding: 30px;
              border-radius: 12px;
              box-shadow: var(--shadow);
              border: 1px solid var(--border-color);
          }

          .price-box {
              max-width: 100%;
              margin: 0;
              max-height: 420px;
              padding: 30px;
              background: white;
              border-radius: 12px;
              box-shadow: var(--shadow);
              border: 1px solid var(--border-color);
          }

          .price-box .section-title {
              text-align: left;
              margin-bottom: 25px;
          }

          .price-details {
              width: 100%;
          }

          .price-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              padding-bottom: 8px;
              color: #444;
          }

          .price-row:last-of-type {
              margin-bottom: 0;
          }

          .price-label {
              text-align: left;
              font-size: 16px;
          }

          .price-value {
              text-align: right;
              font-size: 16px;
              font-weight: 500;
          }

          .price-subtotal {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px dashed var(--border-color);
              font-size: 17px;
          }

          .price-total {
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px solid var(--border-color);
              font-size: 20px;
              font-weight: 700;
              color: var(--secondary-color);
          }

          .price-notes {
              margin-top: 15px;
              font-size: 14px;
              color: #666;
              text-align: right;
              font-style: italic;
          }

          .card-details {
              margin-top: 20px;
              padding: 20px;
              border: 1px solid var(--border-color);
              border-radius: 8px;
              background-color: #f9f9f9;
              margin-bottom: 20px;
          }

          .form-group {
              margin-bottom: 15px;
              margin-right: 15px;
          }

          .form-group label {
              display: block;
              margin-bottom: 5px;
              font-weight: 500;
              color: #444;
          }

          .form-group input {
              width: 100%;
              padding: 10px;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              font-size: 16px;
          }

          .form-row {
              display: flex;
              gap: 15px;
          }

          .form-row .form-group {
              flex: 1;
          }

          .payment-disclaimer {
              margin-top: 10px;
              padding: 12px 15px;
              background-color: #f8f8f8;
              border-left: 4px solid var(--accent-color);
              color: #555;
              font-size: 14px;
              border-radius: 0 4px 4px 0;
          }

          .card-details, .payment-disclaimer {
              display: none;
          }

          .card-details.active, .payment-disclaimer.active {
              display: block !important;
          }

          .confirm-btn {
              background-color: var(--primary-color);
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 30px;
              font-size: 18px;
              font-weight: 600;
              cursor: pointer;
              display: block;
              margin: 30px auto;
              transition: all 0.3s ease;
              box-shadow: 0 4px 12px rgba(42, 157, 143, 0.3);
              max-width: 300px;
          }

          @media (max-width: 768px) {
              .grid-container {
                  max-height: none;
              }

              .property-item img {
                  min-height: auto;
              }
          }

          @media (max-width: 900px) {
              .grid-container, .payment-container {
                  grid-template-columns: 1fr;
                  gap: 30px;
              }

              .payment-box, .price-box {
                  margin-bottom: 30px;
              }

              .property-item img {
                  height: auto;
                  aspect-ratio: 16/9;
              }

              h1 {
                  font-size: 28px;
                  max-width: 300px;
              }
          }
      `)
    );
    document.head.appendChild(link);

    return () => {
      // Remove the booking_style.css when the component unmounts
      document.head.removeChild(link);
    };
  }, []);

  const styles = {
    paymentOption: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      padding: "15px",
      marginBottom: "15px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#808080",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      cursor: "pointer",
    },
    paymentOptionActive: {
      borderColor: "#2a9d8f",
      backgroundColor: "rgba(42, 157, 143, 0.05)",
    },
    radioInput: {
      width: "20px",
      height: "20px",
      marginRight: "15px",
      accentColor: "#2a9d8f",
      cursor: "pointer",
      flexShrink: 0,
    },
    radioLabel: {
      flex: 1,
      fontSize: "16px",
      marginBottom: 0,
      cursor: "pointer",
    },
    radioLabelChecked: {
      fontWeight: 600,
      color: "#2a9d8f",
    },
    cardDetails: {
      marginTop: "20px",
      padding: "20px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#808080",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      marginBottom: "20px",
      display: "block",
    },
    paymentDisclaimer: {
      marginTop: "10px",
      maxHeight: "100px",
      overflow: "auto",
      padding: "12px 15px",
      backgroundColor: "#f8f8f8",
      borderLeft: "4px solid #e9c46a",
      color: "#555",
      fontSize: "14px",
      borderRadius: "0 4px 4px 0",
      display: "block",
    },
    guestEditor: {
      display: "flex",
      alignItems: "center",
      marginTop: "10px",
      marginBottom: "15px",
    },
    guestButton: {
      backgroundColor: "transparent",
      border: "1px solid #808080",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      cursor: "pointer",
      margin: "0 10px",
    },
    guestCount: {
      fontSize: "16px",
      fontWeight: "bold",
      width: "30px",
      textAlign: "center",
    },
    guestSaveButton: {
      backgroundColor: "#2a9d8f",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "5px 15px",
      fontSize: "14px",
      marginLeft: "15px",
      cursor: "pointer",
    },
    datePickerContainer: {
      marginTop: "10px",
      marginBottom: "15px",
      padding: "15px",
      background: "#f9f9f9",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    dateSaveButton: {
      backgroundColor: "#2a9d8f",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "5px 15px",
      fontSize: "14px",
      marginTop: "10px",
      marginLeft: "auto",
      display: "block",
      cursor: "pointer",
    },
    dateError: {
      color: "#e63946",
      fontSize: "14px",
      marginTop: "5px",
    },
    datePickerCustomStyles: {
      ".react-datepicker": {
        width: "100%",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      },
      ".react-datepicker__month-container": {
        width: "50%",
      },
    },
  };

  useEffect(() => {
    // Only use these styles when datepicker is open
    if (isEditingDates) {
      const style = document.createElement("style");
      style.id = "datepicker-styles";
      style.innerHTML = `
        .custom-datepicker {
          width: 100% !important;
          border: none !important;
          max-width: 100% !important;
        }
        .react-datepicker {
          width: 100% !important;
          max-width: 350px !important; // Adjusted width for single month
          margin: 0 auto !important; // Center align the calendar
        }
        .react-datepicker__month-container {
          width: 100% !important; // Take full width as there's only one month
        }
        .your_trip-card {
          overflow: visible !important;
          max-width: none !important;
        }
        // Make the calendar days larger and more readable
        .react-datepicker__day {
          margin: 0.2rem !important;
          width: 2rem !important;
          height: 2rem !important;
          line-height: 2rem !important;
          font-size: 0.9rem !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById("datepicker-styles");
        if (existingStyle) existingStyle.remove();
      };
    }
  }, [isEditingDates]);

  // Add state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Add validation for credit card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [billingZip, setBillingZip] = useState("");

  // Validation function
  const validateForm = () => {
    if (paymentMethod === "credit-card") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
        setSubmitError("Please enter a valid card number");
        return false;
      }
      if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        setSubmitError("Please enter a valid expiration date (MM/YY)");
        return false;
      }
      if (!cardCvv || !cardCvv.match(/^\d{3}$/)) {
        setSubmitError("Please enter a valid 3-digit security code");
        return false;
      }
      if (!cardName) {
        setSubmitError("Please enter the name on your card");
        return false;
      }
      if (!billingZip) {
        setSubmitError("Please enter your billing zip code");
        return false;
      }
    }

    // Check date selection
    if (!startDate || !endDate) {
      setSubmitError("Please select your check-in and check-out dates");
      return false;
    }

    if (checkDateRangeAvailability(startDate, endDate)) {
      setSubmitError("Your selected dates include unavailable dates");
      return false;
    }

    return true;
  };

  const [showModal, setShowModal] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [newReviewText, setNewReviewText] = useState("");

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [selectedPRating, setSelectedPRating] = useState(0);
  const [hoveredPRating, setHoveredPRating] = useState(0);

  const [reviewing, setReviewing] = useState(false);

  const handleReviews = async (e) => {
    e.preventDefault();
    setReviewError("");

    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("propertyId");

    if (!propertyId) {
      setSubmitError("Property ID is missing");
      return;
    }

    try {
      setReviewing(true);

      // Fetch property details to get the lister
      const propertyRes = await fetch(`/api/properties/${propertyId}`);
      const propertyData = await propertyRes.json();

      if (!propertyRes.ok) {
        setSubmitError("Failed to fetch property details");
        return;
      }

      // Log property data for debugging
      console.log("Property Data:", propertyData);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property: propertyId,
          ratingLister: selectedRating,
          ratingProperty: selectedPRating,
          text: newReviewText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReviewError(data.message || "Failed to create review");
      } else {
        setShowModal(false);
        router.push("/userpage");
      }
    } catch (error) {
      setReviewError(
        error.message || "An error occurred while processing your review"
      );
      console.error("Review error:", error);
    } finally {
      setReviewing(false);
    }
  };
  // Handler for form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Get propertyId from URL parameters or from props
    // Example: /booking?propertyId=123
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("propertyId");

    if (!propertyId) {
      setSubmitError("Property ID is missing");
      return;
    }

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          guestCount,
          propertyId,
          paymentMethod,
          totalPrice: priceDetails.total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.message || "Failed to create booking");
      } else {
        setSubmitSuccess(true);
        function delay() {
          return new Promise((resolve) => setTimeout(resolve, 1500));
        }
        await delay();
        setShowModal(true);
      }
    } catch (error) {
      setSubmitError(
        error.message || "An error occurred while processing your booking"
      );
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch property details
  const fetchPropertyDetails = async (propertyId) => {
    try {
      setLoading(true);

      if (!propertyId) {
        const urlParams = new URLSearchParams(window.location.search);
        propertyId = urlParams.get("propertyId");
      }

      if (!propertyId) {
        setSubmitError("Property ID is missing");
        return;
      }

      const response = await fetch(`/api/properties/${propertyId}`);

      if (!response.ok) {
        throw new Error("Failed to load property details");
      }

      const data = await response.json();
      setProperty(data.property);

      // Update price calculations based on property data
      const updatedPriceDetails = {
        nightlyRate: data.property.price,
        nights,
        subtotal: data.property.price * nights,
        cleaningFee: data.property.cleaningFee || 2500,
        serviceFee: data.property.serviceFee || 500,
        total:
          data.property.price * nights +
          (data.property.cleaningFee || 2500) +
          (data.property.serviceFee || 500),
      };
      setPriceDetails(updatedPriceDetails);

      // Update unavailable dates
      if (data.property.unavailableDates) {
        const formattedDates = data.property.unavailableDates.map(
          (date) => new Date(date)
        );
        setUnavailableDates(formattedDates);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      setSubmitError("Could not load property details");
    } finally {
      setLoading(false);
    }
  };

  // to fetch property when nights change
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("propertyId");
    if (propertyId) {
      fetchPropertyDetails(propertyId);
    }
  }, [nights]);

  // initialize with URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get("propertyId");
    const checkInParam = params.get("checkIn");
    const checkOutParam = params.get("checkOut");

    if (propertyId && checkInParam && checkOutParam) {
      // Set your booking state with these values
      setStartDate(new Date(checkInParam));
      setEndDate(new Date(checkOutParam));
      fetchPropertyDetails(propertyId);
    }
  }, []);

  return (
    <>
      <Header />
      <div className="booking-page" style={{ paddingTop: "80px" }}>
        <h1>Confirm and Pay</h1>

        <div
          className="grid-container"
          style={
            isEditingDates ? { gap: "30px", alignItems: "flex-start" } : {}
          }
        >
          {/* Your Trip card */}
          <div
            className="your_trip-card"
            style={
              isEditingDates
                ? {
                    maxHeight: "none",
                    height: "auto",
                    overflow: "visible",
                    width: "100%",
                    boxSizing: "border-box",
                  }
                : {}
            }
          >
            <div className="section-title">Your Trip</div>

            {/* Date selection */}
            <div className="date-container">
              <span>Dates</span>
              <button className="edit-btn" onClick={handleDateEditClick}>
                Edit
              </button>
            </div>

            {isEditingDates ? (
              <div style={styles.datePickerContainer}>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  minDate={new Date()}
                  filterDate={(date) => !isDateUnavailable(date)}
                  monthsShown={1}
                  calendarClassName="custom-datepicker"
                  showMonthDropdown
                />
                {dateError && <div style={styles.dateError}>{dateError}</div>}
                <button
                  style={styles.dateSaveButton}
                  onClick={handleDateSave}
                  disabled={!!dateError || !startDate || !endDate}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>{dateRangeText}</div>
            )}

            {/* Guest editing */}
            <div className="guest-container">
              <span>Guests</span>
              <button className="edit-btn" onClick={handleGuestEditClick}>
                Edit
              </button>
            </div>
            {isEditingGuests ? (
              <div style={styles.guestEditor}>
                <button
                  style={styles.guestButton}
                  onClick={() => handleGuestCountChange(guestCount - 1)}
                  disabled={guestCount <= 1}
                >
                  -
                </button>
                <span style={styles.guestCount}>{guestCount}</span>
                <button
                  style={styles.guestButton}
                  onClick={() => handleGuestCountChange(guestCount + 1)}
                  disabled={guestCount >= 10}
                >
                  +
                </button>
                <button
                  style={styles.guestSaveButton}
                  onClick={handleGuestEditSave}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                {guestCount} {guestCount === 1 ? "guest" : "guests"}
              </div>
            )}
          </div>

          {/* Property card*/}
          <div className="property-card">
            <div className="section-title">Selected Property</div>
            {loading ? (
              <div>Loading property details...</div>
            ) : property ? (
              <div className="property-item">
                <img
                  src={property.image}
                  alt={property.propertytitle}
                  width="800"
                  height="250"
                  loading="eager"
                  onError={handleImageError}
                />
                <div className="property-details">
                  <h3>{property.propertytitle}</h3>
                  <p>{property.description}</p>
                  <p>
                    <strong>Location:</strong> {property.location}
                  </p>
                </div>
              </div>
            ) : (
              <div>Failed to load property details</div>
            )}
          </div>
        </div>

        {/* Payment container */}
        <div className="payment-container">
          {/* Form now only wraps the payment-box */}
          <form className="payment-box" onSubmit={handleBookingSubmit}>
            <div className="section-title">Pay With</div>

            {/* Add error message at the top of the form */}
            {submitError && (
              <div
                style={{
                  color: "#e63946",
                  backgroundColor: "#f8d7da",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                {submitError}
              </div>
            )}

            {/* Add success message */}
            {submitSuccess && (
              <div
                style={{
                  color: "#2a9d8f",
                  backgroundColor: "#d4edda",
                  padding: "20px",
                  borderRadius: "5px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                <h3>Booking Confirmed!</h3>
                <p>Your reservation has been successfully processed.</p>
                <p>Check your email for confirmation details.</p>
              </div>
            )}

            {/* Credit Card Option*/}
            <div
              style={{
                ...styles.paymentOption,
                ...(paymentMethod === "credit-card"
                  ? styles.paymentOptionActive
                  : {}),
              }}
              onClick={() => handlePaymentMethodChange("credit-card")}
            >
              <input
                type="radio"
                id="credit-card"
                name="payment-method"
                value="credit-card"
                checked={paymentMethod === "credit-card"}
                onChange={() => {}} // Empty handler to avoid React warning
                style={styles.radioInput}
              />
              <label
                htmlFor="credit-card"
                style={{
                  ...styles.radioLabel,
                  ...(paymentMethod === "credit-card"
                    ? styles.radioLabelChecked
                    : {}),
                }}
              >
                Credit Card
              </label>
            </div>

            {/* Card details section */}
            {paymentMethod === "credit-card" && (
              <div style={styles.cardDetails}>
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input
                    type="text"
                    id="card-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiration Date</label>
                    <input
                      type="text"
                      id="expiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">Security Code</label>
                    <input
                      type="text"
                      id="cvv"
                      value={cardCvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="card-name">Name on Card</label>
                  <input
                    type="text"
                    id="card-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="billing-zip">Billing Zip/Postal Code</label>
                  <input
                    type="text"
                    id="billing-zip"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>
            )}

            {/* Cash Option */}
            <div
              style={{
                ...styles.paymentOption,
                ...(paymentMethod === "Cash" ? styles.paymentOptionActive : {}),
              }}
              onClick={() => handlePaymentMethodChange("Cash")}
            >
              <input
                type="radio"
                id="Cash"
                name="payment-method"
                value="Cash"
                checked={paymentMethod === "Cash"}
                onChange={() => {}} // Empty handler to avoid React warning
                style={styles.radioInput}
              />
              <label
                htmlFor="Cash"
                style={{
                  ...styles.radioLabel,
                  ...(paymentMethod === "Cash" ? styles.radioLabelChecked : {}),
                }}
              >
                Cash
              </label>
            </div>

            {/* Cash disclaimer */}
            {paymentMethod === "Cash" && (
              <div style={styles.paymentDisclaimer}>
                <p>
                  <strong>Note:</strong> If you choose the cash option, you will
                  pay the required amount to the property caretaker.
                </p>
              </div>
            )}
          </form>

          {/* Price box */}
          <div className="price-box">
            <div className="section-title">Price Details</div>
            <div className="price-details">
              <div className="price-row">
                <div className="price-label">
                  ₱{priceDetails.nightlyRate.toLocaleString()} ×{" "}
                  {priceDetails.nights} nights
                </div>
                <div className="price-value">
                  ₱{priceDetails.subtotal.toLocaleString()}
                </div>
              </div>
              <div className="price-row">
                <div className="price-label">Cleaning fee</div>
                <div className="price-value">
                  ₱{priceDetails.cleaningFee.toLocaleString()}
                </div>
              </div>
              <div className="price-row">
                <div className="price-label">Service fee</div>
                <div className="price-value">
                  ₱{priceDetails.serviceFee.toLocaleString()}
                </div>
              </div>
              <div className="price-row price-subtotal">
                <div className="price-label">Subtotal</div>
                <div className="price-value">
                  ₱{priceDetails.total.toLocaleString()}
                </div>
              </div>
              <div className="price-row price-total">
                <div className="price-label">Total (PHP)</div>
                <div className="price-value">
                  ₱{priceDetails.total.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="price-notes">You won't be charged yet</div>
          </div>
        </div>

        {/* Confirmation Button */}
        <button
          type="submit"
          className="confirm-btn"
          onClick={handleBookingSubmit}
          disabled={
            isSubmitting ||
            !!dateError ||
            checkDateRangeAvailability(startDate, endDate)
          }
          style={isSubmitting ? { opacity: 0.7, cursor: "not-allowed" } : {}}
        >
          {isSubmitting ? "Processing..." : "Confirm and Pay"}
        </button>

        {showModal && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div
              className="bg-white p-12 rounded-xl max-w-lg w-full relative shadow-lg"
              style={{ transform: "scale(1)" }}
            >
              <h2 className="text-2xl font-bold mb-4">Review</h2>
              <p className="text-lg text-black-500 mt-2">Lister Rating</p>

              <div className="flex items-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setSelectedRating(star)}
                    className={`cursor-pointer text-4xl ${
                      (hoveredRating || selectedRating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-lg text-black-500 mt-2">Property Rating</p>

              <div className="flex items-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onMouseEnter={() => setHoveredPRating(star)}
                    onMouseLeave={() => setHoveredPRating(0)}
                    onClick={() => setSelectedPRating(star)}
                    className={`cursor-pointer text-4xl ${
                      (hoveredPRating || selectedPRating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Review Form */}
              <textarea
                maxLength={100}
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md resize-none text-lg"
                rows={6}
                placeholder="Type your review..."
              />
              <p className="text-lg text-gray-500 mt-2">
                {newReviewText.length}/100
              </p>

              <button
                onClick={handleReviews}
                className="mt-8 px-8 py-4 bg-black text-white font-medium rounded-md transition duration-200 hover:bg-[#3B4754]"
                disabled={selectedRating === 0 || loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              {reviewError && (
                <p className="text-red-500 text-lg mt-4">{reviewError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingConfirmation;
