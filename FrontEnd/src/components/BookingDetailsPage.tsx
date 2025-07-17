import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  User,
  Mail,
  File,
  ReceiptText,
  StickyNote,
  ArrowLeft,
  Pencil,
  Save,
  XCircle,
} from "lucide-react";

const BookingDetailsPage = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  // console.log(id);
  const [booking, setBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/booking/booking/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data.data);
        setEditedData(data.data);
      })
      .catch((err) => console.error("Failed to fetch booking", err));
  }, [id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/booking/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      alert("Booking updated!");
      setBooking(updated.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating booking");
    }
  };

  if (!booking) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-16">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-blue-600 mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Booking Details</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-blue-600"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-green-600"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedData(booking);
                }}
                className="flex items-center gap-1 text-red-600"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 text-gray-800">
          {/* Name */}
          <label className="block">
            <User className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Name:</strong>&nbsp;
            {isEditing ? (
              <input
                name="customerName"
                value={editedData.customerName}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              booking.customerName
            )}
          </label>

          {/*Email */}
          <label className="block">
            <Mail className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Email:</strong>&nbsp;
            {isEditing ? (
              <input
                name="email"
                value={editedData.email}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              booking.email
            )}
          </label>

          {/* Phone */}
          <label className="block">
            <Phone className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Phone:</strong>&nbsp;
            {isEditing ? (
              <input
                name="contactNumber"
                value={editedData.contactNumber}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              booking.contactNumber
            )}
          </label>

          {/* Date */}
          <label className="block">
            <Calendar className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Date:</strong>&nbsp;
            {isEditing ? (
              <input
                type="date"
                name="eventDate"
                value={editedData.eventDate?.split("T")[0]}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              formatDate(booking.eventDate)
            )}
          </label>

          {/* Time */}
          <label className="block">
            <Clock className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Time:</strong>&nbsp;
            {isEditing ? (
              <input
                type="time"
                name="eventTime"
                value={editedData.eventTime}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              booking.eventTime
            )}
          </label>

          {/* Guests */}
          <label className="block">
            <Users className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Guests:</strong>&nbsp;
            {isEditing ? (
              <input
                name="numberOfGuests"
                value={editedData.numberOfGuests}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              booking.numberOfGuests
            )}
          </label>

          {/* Amounts */}
          <label className="block">
            <ReceiptText className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Total:</strong>&nbsp;
            {isEditing ? (
              <input
                name="totalAmount"
                value={editedData.totalAmount}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              `₹${booking.totalAmount}`
            )}
          </label>

          <label className="block">
            <ReceiptText className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Paid:</strong>&nbsp;
            {isEditing ? (
              <input
                name="amountPaid"
                value={editedData.amountPaid}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              `₹${booking.amountPaid}`
            )}
          </label>

          {/* Notes */}
          <label className="block">
            <StickyNote className="w-5 h-5 inline mr-2 text-gray-500" />
            <strong>Notes:</strong>&nbsp;
            {isEditing ? (
              <textarea
                name="notes"
                value={editedData.notes}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              booking.notes || "—"
            )}
            {isEditing ? <strong>AdditionalAmount</strong> : ""}
            {isEditing ? (
              <input
                name="additionalAmount"
                value={editedData.additionalAmount}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-1"
              />
            ) : (
              ""
            )}
            {booking.menu && (
              <div className="mt-4">
                <strong>Menu:</strong>{" "}
                {booking.menu.endsWith(".pdf") ? (
                  <a
                    href={booking.menu}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    View PDF
                  </a>
                ) : (
                  <img
                    src={booking.menu}
                    alt="Menu"
                    className="mt-2 rounded-lg border shadow-md max-w-xs"
                  />
                )}
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
