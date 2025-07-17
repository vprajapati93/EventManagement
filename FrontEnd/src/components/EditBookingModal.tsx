const EditBookingModal = ({ booking, onClose }) => {
  const [formData, setFormData] = useState({ ...booking });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Booking</h2>

        <input
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-3"
          placeholder="Customer Name"
        />

        <input
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-3"
          placeholder="Event Type"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-beige-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditBookingModal;
