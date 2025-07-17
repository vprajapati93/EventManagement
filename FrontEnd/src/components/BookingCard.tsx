import {
  Calendar,
  Clock,
  Users,
  Phone,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

const BookingCard = ({ booking }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/booking/${booking.id}`);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "wedding":
        return "💒";
      case "corporate":
        return "🏢";
      case "birthday":
        return "🎂";
      case "anniversary":
        return "💕";
      default:
        return "🎉";
    }
  };

  const handleDeleteBooking = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmDelete) return;
    console.log(id);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/booking/cancel/${id}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Cancel failed");

      alert("Booking cancelled.");
      window.location.reload(); // or refetch data if using SWR/react-query
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div
      className={`relative rounded-xl p-6 shadow-md transition-all ${
        booking.status === "cancelled"
          ? "bg-gray-100 opacity-50 cursor-not-allowed"
          : "bg-white/50 hover:scale-[1.01]"
      }`}
    >
      <div className="absolute top-3 right-3 flex space-x-2">
        <button
          className="text-gray-500 hover:text-yellow-600 transition"
          title="Edit Booking"
        >
          ✏️
        </button>

        <button
          onClick={() => handleDeleteBooking(booking.id)}
          className="text-gray-500 hover:text-red-500 transition"
          title="Cancel Booking"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-3 mb-2">
        <span className="text-2xl">{getEventTypeIcon(booking.eventType)}</span>
        <div>
          <h3 className="text-lg font-semibold">{booking.eventType} Event</h3>
          <p className="text-sm text-gray-600">
            Booked on {formatDate(booking.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-beige-500" />
          {formatDate(booking.eventDate)}
        </div>
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-beige-500" />
          {booking.name}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-beige-500" />
          {booking.eventTime}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-beige-500" />
          {booking.guests} guests
        </div>

        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-beige-500" />
          {booking.phone}
        </div>
        <div className="flex items-center">
          💰- ₹{booking.pendingAmount?.toLocaleString() || 0}
        </div>
      </div>

      {booking.specialRequests && (
        <div className="mt-3 p-3 bg-beige-50 rounded-md text-sm">
          <span className="font-medium">Special Requests:</span>{" "}
          {booking.specialRequests}
        </div>
      )}
      <div className="flex justify-between items-center mt-4 ml-1 text-xs text-gray-600">
        <button onClick={handleClick}>View Full Details</button>

        {booking.inquiryNumber && (
          <p className="text-xs italic text-gray-500 text-right">
            Booked via: {booking.inquiryNumber}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
