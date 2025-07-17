import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Phone,
  Users,
  Clock,
  Heart,
  Star,
  Sparkles,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  hallType: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guests: string;
  duration: string;
  specialRequests: string;
}

const InquiryForm = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    hallType: "",
    phone: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    guests: "",
    duration: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState("");

  const eventTypes = [
    { value: "wedding", label: "Wedding", icon: Heart },
    { value: "corporate", label: "Corporate Event", icon: Star },
    { value: "birthday", label: "Birthday Party", icon: Sparkles },
    { value: "anniversary", label: "Anniversary", icon: Heart },
    { value: "other", label: "Other", icon: Calendar },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      customerName: formData.name,
      contactNumber: formData.phone,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      numberOfGuests: formData.guests,
      HallType: formData.hallType,
      notes: formData.specialRequests,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/inquiry/generateInquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Submission failed");

      alert("Booking submitted successfully!");
      navigate("/");

      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        eventTime: "",
        guests: "",
        duration: "",
        specialRequests: "",
        hallType: "",
      });
    } catch (err) {
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-10 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7 animate-slide-up">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-3d-lg border border-white/20 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50"
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
                      className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50"
                    />
                    <label htmlFor="phone">Phone Number</label>
                  </div>
                </div>

                {/* Event Details */}
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
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
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50"
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
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50"
                      />
                      <label htmlFor="eventDate">Event Date</label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="form-floating-label">
                      <input
                        type="time"
                        id="eventTime"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50"
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
                        min="1"
                        required
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50"
                      />
                      <label htmlFor="guests">Guests</label>
                    </div>

                    <div className="form-floating-label">
                      <select
                        id="hallType"
                        name="hallType"
                        value={formData.hallType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50"
                      >
                        <option value="" disabled hidden></option>
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                      </select>
                      <label htmlFor="hallType">Hall Type</label>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="pt-4">
                  <label
                    htmlFor="specialRequests"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Special Requests or Additional Info
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-3 border border-beige-200 rounded-lg bg-white/50 resize-none"
                    placeholder="Decor, timing, dietary needs..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-beige-400 to-beige-500 text-white font-semibold py-4 px-6 rounded-lg transition-all hover:scale-[1.02] shadow-lg"
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

          {/* New Right-Side: Availability Checker */}
          {/* <div className="lg:col-span-3 animate-slide-up">
            <div className="bg-white/70 p-6 rounded-2xl shadow-3d border border-white/20 sticky top-24">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Check Booking Availability
              </h3>
              <input
                type="date"
                value={availabilityDate}
                onChange={(e) => setAvailabilityDate(e.target.value)}
                className="w-full mb-4 px-3 py-2 border border-beige-200 rounded-lg bg-white"
              />
              <button
                onClick={handleAvailabilityCheck}
                className="w-full bg-beige-500 text-white px-4 py-2 rounded hover:bg-beige-600 transition"
              >
                Check
              </button>

              {availabilityResult && (
                <div className="mt-4 border-t pt-4 text-sm text-gray-700">
                  <p>
                    <strong>Booked By:</strong>{" "}
                    {availabilityResult.customerName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {availabilityResult.contactNumber}
                  </p>
                  <p>
                    <strong>Event:</strong> {availabilityResult.eventType}
                  </p>
                  <p>
                    <strong>Time:</strong> {availabilityResult.eventTime}
                  </p>
                </div>
              )}

              {availabilityResult === null && availabilityDate && (
                <p className="text-green-600 mt-4">✅ Date is available!</p>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;
