import React, { useState } from "react";
import {
  Calendar,
  Phone,
  Mail,
  Users,
  Clock,
  Heart,
  Star,
  Sparkles,
} from "lucide-react";
import { menu } from "framer-motion/client";

interface FormData {
  name: string;
  phone: string;
  email: string;
  hallType: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guests: string;
  duration: string;
  specialRequests: string;
  totalAmount: number;
  amountPaid: number;
  menu: String;
  bookingStatus: string;
}

const BookingForm = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState<FormData>({
    name: "",
    hallType: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    guests: "",
    duration: "",
    specialRequests: "",
    amountPaid: 0,
    totalAmount: 0,
    menu: "",
    bookingStatus: "",
  });

  const [menuFile, setMenuFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventTypes = [
    { value: "wedding", label: "Wedding", icon: Heart },
    { value: "corporate", label: "Corporate Event", icon: Star },
    { value: "birthday", label: "Birthday Party", icon: Sparkles },
    { value: "anniversary", label: "Anniversary", icon: Heart },
    { value: "other", label: "Other", icon: Calendar },
  ];

  const [isDateAvailable, setIsDateAvailable] = useState(true);

  const checkDateAvailability = async (selectedDate: string) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/booking/isBookingAvailable/${selectedDate}`
      );
      if (res.status === 409) {
        setIsDateAvailable(false);
        // Optional: show popup or toast
      } else {
        const data = await res.json();
        setIsDateAvailable(data.available);
      }
    } catch (err) {
      console.error("Error checking date", err);
      setIsDateAvailable(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "eventDate") {
      checkDateAvailability(value); // 👈 Call here
    }
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // If hallType is changed, suggest a default totalAmount
      if (name === "hallType") {
        if (
          value === "AC" &&
          (!prev.totalAmount || prev.totalAmount === 50000)
        ) {
          updated.totalAmount = 80000;
        } else if (
          value === "Non-AC" &&
          (!prev.totalAmount || prev.totalAmount === 80000)
        ) {
          updated.totalAmount = 50000;
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData(); // browser's FormData, not your interface

      payload.append("customerName", formData.name);
      payload.append("contactNumber", formData.phone);
      payload.append("email", formData.email);
      payload.append("eventType", formData.eventType);
      payload.append("eventDate", formData.eventDate);
      payload.append("eventTime", formData.eventTime);
      payload.append("numberOfGuests", formData.guests);
      payload.append("HallType", formData.hallType);
      payload.append("amountPaid", formData.amountPaid.toString());
      payload.append("totalAmount", formData.totalAmount.toString());
      payload.append("notes", formData.specialRequests);
      payload.append("bookingStatus", formData.bookingStatus);

      // Add file if present
      if (menuFile) {
        payload.append("menu", menuFile);
      }

      const response = await fetch(`${BASE_URL}/api/v1/booking/directBooking`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) throw new Error("Submission failed");

      alert("Booking submitted successfully!");
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        eventType: "",
        eventDate: "",
        eventTime: "",
        guests: "",
        duration: "",
        specialRequests: "",
        hallType: "",
        amountPaid: 0,
        totalAmount: 0,
        bookingStatus: "",
        menu: "", // this is unused when sending File, can be removed
      });
      setMenuFile(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Main Content - 70-30 Split */}
        <div className="grid lg:grid-cols-10 gap-8 lg:gap-12">
          {/* Form Section - 70% */}
          <div className="lg:col-span-7 animate-slide-up">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-3d-lg border border-white/20 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-floating-label">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder=" "
                      className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all"
                    />
                    <label htmlFor="name">Full Name</label>
                  </div>

                  <div className="form-floating-label">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder=" "
                      className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all"
                    />
                    <label htmlFor="phone">Phone Number</label>
                  </div>
                </div>
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="form-floating-label">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder=" "
                      className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all"
                    />
                    <label htmlFor="name">Email</label>
                  </div>
                </div>

                {/* Event Details */}
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-beige-500" />
                    Event Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-floating-label">
                      <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all"
                      >
                        <option value="" disabled hidden></option>
                        {eventTypes.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="eventType">Event Type</label>
                    </div>

                    <div className="form-floating-label">
                      <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                        placeholder=" "
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all"
                      />
                      <label htmlFor="eventDate">Event Date</label>
                    </div>
                    {!isDateAvailable && (
                      <p className="text-red-600 text-sm mt-1">
                        This date is already booked. Please choose another.
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="form-floating-label">
                      <input
                        type="time"
                        id="eventTime"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all"
                      />
                      <label htmlFor="eventTime">Start Time</label>
                    </div>

                    <div className="form-floating-label">
                      <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder=" "
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all"
                      />
                      <label htmlFor="guests">Number of Guests</label>
                    </div>

                    <div className="form-floating-label">
                      <select
                        id="hallType"
                        name="hallType"
                        value={formData.hallType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all"
                      >
                        <option value="" disabled hidden></option>
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                      </select>
                      <label htmlFor="duration">Hall Type</label>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-floating-label animate-fade-in">
                    <input
                      type="number"
                      id="totalAmount"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      placeholder=" "
                      required
                      className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all focus:ring-2 focus:ring-beige-400"
                    />
                    <label htmlFor="totalAmount">Total Amount (₹)</label>
                  </div>

                  <div className="form-floating-label animate-fade-in delay-100">
                    <input
                      type="number"
                      id="amountPaid"
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleInputChange}
                      placeholder=" "
                      required
                      className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all focus:ring-2 focus:ring-beige-400"
                    />
                    <label htmlFor="paidAmount">Amount Paid (₹)</label>
                  </div>
                </div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Menu (PDF/Image)
                </label>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => setMenuFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />

                {/* Special Requests */}
                <div className="pt-4">
                  <label
                    htmlFor="specialRequests"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Special Requests or Additional Information
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 transition-all resize-none"
                    placeholder="Tell us about any special requirements, dietary restrictions, decorative preferences, or other details..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-beige-400 to-beige-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-beige-500 hover:to-beige-600 focus:outline-none focus:ring-2 focus:ring-beige-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Submit Enquiry"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
