import React, { useState, useEffect } from "react";

const BookingFormModal = ({ inquiry, onClose }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    contactNumber: "",
    eventType: "",
    eventTime: "",
    inquiryNumber: "",
    eventDate: "",
    numberOfGuests: "",
    HallType: "",
    notes: "",
    totalAmount: "",
    amountPaid: "",
  });

  const [menuFile, setMenuFile] = useState<File | null>(null);

  useEffect(() => {
    if (inquiry) {
      const rawDate = inquiry.eventDate;
      const parsedDate = new Date(rawDate);
      const formattedDate = !isNaN(parsedDate)
        ? parsedDate.toISOString().split("T")[0]
        : "";

      setFormData((prev) => ({
        ...prev, //preserves all typed fields i dont manually need to provide
        customerName: inquiry.name || "",
        contactNumber: inquiry.phone || "",
        eventType: inquiry.eventType || "",
        eventDate: formattedDate,
        eventTime: inquiry.eventTime || "",
        numberOfGuests: inquiry.guests || "",
        HallType: inquiry.hallType || "",
        notes: inquiry.specialRequests || "",
        inquiryNumber: inquiry.inquiryNumber || "",
        totalAmount: inquiry.totalAmount || "",
        amountPaid: inquiry.amountPaid || "",
      }));
    }
  }, [inquiry]);

  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10); // delay to trigger animation
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("customerName", formData.customerName);
      form.append("email", formData.email);
      form.append("contactNumber", formData.contactNumber);
      form.append("eventType", formData.eventType);
      form.append("eventTime", formData.eventTime);
      form.append("eventDate", formData.eventDate);
      form.append("numberOfGuests", formData.numberOfGuests);
      form.append("HallType", formData.HallType);
      form.append("notes", formData.notes);
      form.append("totalAmount", formData.totalAmount);
      form.append("amountPaid", formData.amountPaid);
      if (menuFile) {
        form.append("menu", menuFile);
      }
      const res = await fetch(
        `${BASE_URL}/api/v1/booking/bookingfromInquiry/${inquiry.inquiryNumber}`,
        {
          method: "POST",
          body: form,
        }
      );

      const responseData = await res.json();

      if (!res.ok) {
        alert(responseData.message || "Booking failed");
        return;
      }

      alert("Booking created");
      onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      console.log(e);
      alert("Unexpected error while booking");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300
  ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
  max-h-[90vh] overflow-y-auto
`}
      >
        <h2 className="text-xl font-bold mb-4">Book Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Customer Name"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
          />
          <input
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Contact Number"
          />
          <input
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Event Type"
          />
          <input
            name="eventDate"
            type="date"
            value={
              formData.eventDate
                ? new Date(formData.eventDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="time"
            id="eventTime"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
            placeholder=" "
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Guests"
          />
          <input
            name="HallType"
            value={formData.HallType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Hall Type"
          />
          <input
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Notes"
          />
          <input
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Total Amount"
          />
          <input
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Amount Paid"
          />
          <label className="block text-sm font-medium text-gray-700">
            Upload Menu
          </label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setMenuFile(e.target.files?.[0] || null)}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;
