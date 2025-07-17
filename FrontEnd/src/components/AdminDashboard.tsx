import React, { useState, useEffect } from "react";
import Calendar from "react-Calendar";
import BookingCard from "./BookingCard.tsx";
import InquiryCard from "./InquiryCard.tsx";
import BookingFormModal from "./BookingFormModal.tsx";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  totalAmount: number;
  amountPaid: number;
  pendingAmount: string;
  guests: number;
  inquiryNumber: string;
  hallType: String;
  menu: string;
  status: "confirmed" | "cancelled" | "enquiry";
  createdAt: string;
  specialRequests: string;
}
interface Inquiry {
  id: string;
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guests: number;
  hallType: String;
  status: "confirmed" | "cancelled" | "enquiry";
  createdAt: string;
  inquiryNumber: string;
  specialRequests: string;
}

const AdminDashboard = ({ setBookedDates }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "pending" | "confirmed"
  >("confirmed");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // use effect for BOOKING
  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/booking/fetchallbooking`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.data.map((b: any) => ({
          id: b._id,
          name: b.customerName,
          email: b.email,
          totalAmount: b.totalAmount,
          phone: b.contactNumber,
          amountPaid: b.amountPaid,
          eventType: b.eventType.toLowerCase(),
          eventDate: b.eventDate,
          eventTime: b.eventTime,
          guests: Number(b.numberOfGuests),
          status: b.status,
          menu: b.menu,
          inquiryNumber: b.inquiryNumberSnapshot,
          createdAt: b.bookedAt,
          pendingAmount: b.pendingAmount,
          specialRequests: b.notes, // Add if exists
        }));
        setBookings(formatted);
      });
  }, []);

  //useEffect For Inquiry
  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/inquiry/fetchAllInquires`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.data.map((i: any) => ({
          id: i._id,
          name: i.customerName,
          phone: i.contactNumber,
          eventType: i.eventType,
          eventDate: i.eventDate,
          eventTime: i.eventTime,
          totalAmount: i.totalAmount,
          guests: Number(i.numberOfGuests),
          status: "enquiry",
          hallType: i.HallType,
          createdAt: i.createdAt,
          inquiryNumber: i.inquiryNumber,
          specialRequests: i.notes,
        }));
        setInquiries(formatted);
      });
  }, []);

  //For calendar
  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/booking/fetchallbooking`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.data.map((b: any) => ({
          id: b._id,
          eventType: b.eventType.toLowerCase(),
          eventDate: b.eventDate,
          eventTime: b.eventTime,
          status: b.status,
        }));

        const dates = formatted
          .filter((b) => b.status !== "cancelled")
          .map((b) => new Date(b.eventDate).toDateString());
        setBookedDates(dates); // pass up to App
      });
  }, []);

  //CalendarIcon
  const bookedDates = bookings.map((b) => new Date(b.eventDate).toDateString());

  const filteredConfirmedBookings = bookings.filter((b) => {
    const date = new Date(b.eventDate);
    const bookingMonth = date.getMonth() + 1;
    const bookingYear = date.getFullYear();
    const monthMatches =
      selectedMonth === "all" || Number(selectedMonth) === bookingMonth;
    const yearMatches =
      selectedYear === "all" || Number(selectedYear) === bookingYear;
    return monthMatches && yearMatches;
  });

  const filteredPendingInquiries = inquiries.filter((b) => {
    const date = new Date(b.eventDate);
    const inquiryMonth = date.getMonth() + 1;
    const inquiryYear = date.getFullYear();
    const monthMatches =
      selectedMonth === "all" || Number(selectedMonth) === inquiryMonth;
    const yearMatches =
      selectedYear === "all" || Number(selectedYear) === inquiryYear;
    return monthMatches && yearMatches;
  });

  const upcomingBookings = bookings.filter((b) => {
    const eventDate = new Date(b.eventDate);
    const now = new Date();

    const bookingMonth = eventDate.getMonth() + 1;
    const bookingYear = eventDate.getFullYear();

    const monthMatches =
      selectedMonth === "all" || Number(selectedMonth) === bookingMonth;
    const yearMatches =
      selectedYear === "all" || Number(selectedYear) === bookingYear;

    return (
      eventDate >= now &&
      b.status !== "cancelled" &&
      monthMatches &&
      yearMatches
    );
  });

  //Amount formatter
  function formatAmountIndian(number: number) {
    if (number >= 1e7) {
      return (number / 1e7).toFixed(1).replace(/\.0$/, "") + "Cr";
    } else if (number >= 1e5) {
      return (number / 1e5).toFixed(1).replace(/\.0$/, "") + "L";
    } else if (number >= 1e3) {
      return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return number.toString();
  }

  const totalRevenue = filteredConfirmedBookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );

  //Flipped
  const [showRevenue, setShowRevenue] = useState(false);

  const handleCardClick = () => {
    setShowRevenue((prev) => !prev); // toggle between true/false on each click
  };

  const displayedData = (
    activeTab === "upcoming" ? bookings : inquiries
  ).filter((item) => {
    const date = new Date(item.eventDate);
    const monthMatches =
      selectedMonth === "all" || date.getMonth() + 1 === Number(selectedMonth);
    const yearMatches =
      selectedYear === "all" || date.getFullYear() === Number(selectedYear);
    return monthMatches && yearMatches;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "enquiry":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //For opening the popup modal in Inquiry card
  const [selectedInquiry, setSelectedInquiry] = useState<Booking | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const openBookingModal = (inquiry: Booking) => {
    setSelectedInquiry(inquiry);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedInquiry(null);
  };

  ///END OF MODAL SHIT

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your event bookings and enquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-8 mb-8 animate-slide-up">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-3d border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {filteredConfirmedBookings.length}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-beige-500" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-3d border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  UpComing Booking
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {upcomingBookings.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-3d border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {filteredPendingInquiries.length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div
            className={`flip-card-container ${showRevenue ? "flipped" : ""}`}
            onClick={() => setShowRevenue((prev) => !prev)}
          >
            {/* Front: Total Guests */}
            <div className="flip-card-front-card">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Guests
                  </p>
                  <p className="text-3xl font-bold text-beige-600">
                    {filteredConfirmedBookings.reduce(
                      (sum, booking) => sum + Number(booking.guests || 0),
                      0
                    )}
                  </p>
                </div>
                <Users className="w-8 h-8 text-beige-500" />
              </div>
            </div>

            {/* Back: Total Revenue */}
            <div className="flip-card-back-card">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{formatAmountIndian(totalRevenue)}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="mb-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="border-b border-beige-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("confirmed")}
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "confirmed"
                    ? "border-beige-500 text-beige-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Booking ({filteredConfirmedBookings.length})
              </button>

              <button
                onClick={() => setActiveTab("pending")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "pending"
                    ? "border-beige-500 text-beige-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending Enquiries ({filteredPendingInquiries.length})
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "upcoming"
                    ? "border-beige-500 text-beige-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Upcoming Booking ({upcomingBookings.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Month and Year drop down */}

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Years</option>
            {[
              ...new Set(
                (activeTab === "upcoming" ? bookings : inquiries).map((b) =>
                  new Date(b.eventDate).getFullYear()
                )
              ),
            ].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Bookings List */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {activeTab === "upcoming" &&
            upcomingBookings.map((item) => (
              <BookingCard key={item.id} booking={item} />
            ))}

          {activeTab === "confirmed" &&
            filteredConfirmedBookings.map((item) => (
              <BookingCard key={item.id} booking={item} />
            ))}

          {activeTab === "pending" &&
            filteredPendingInquiries.map((item) => (
              <InquiryCard
                key={item.id}
                inquiry={item}
                onBookEvent={() => openBookingModal(item)}
              />
            ))}
        </div>
        {showBookingModal && selectedInquiry && (
          <BookingFormModal
            inquiry={selectedInquiry}
            onClose={closeBookingModal}
          />
        )}

        {/* Empty State */}
        {(activeTab === "upcoming" && upcomingBookings.length === 0) ||
        (activeTab === "pending" && filteredPendingInquiries.length === 0) ||
        (activeTab === "confirmed" &&
          filteredConfirmedBookings.length === 0) ? (
          <div className="text-center py-12 animate-fade-in">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No {activeTab} events
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "upcoming"
                ? "No upcoming events scheduled."
                : activeTab === "pending"
                ? "No pending enquiries to review."
                : activeTab === "confirmed"
                ? "No confirmed bookings yet."
                : "No records found."}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
