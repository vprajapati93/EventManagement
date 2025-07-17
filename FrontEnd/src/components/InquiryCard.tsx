import { Calendar, Phone, User, Users } from "lucide-react";

const InquiryCard = ({ inquiry, onBookEvent }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="bg-white/50 rounded-xl p-6 shadow-md hover:scale-[1.01] transition-all">
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-2xl">📩</span>
        <div>
          <h3 className="text-lg font-semibold">{inquiry.eventType} Inquiry</h3>
          <p className="text-sm text-gray-600">
            Created on {formatDate(inquiry.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-beige-500" />
          {formatDate(inquiry.eventDate)}
        </div>
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-beige-500" />
          {inquiry.name}
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-beige-500" />
          {inquiry.phone}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-beige-500" />
          {inquiry.guests} - {inquiry.hallType}
        </div>
      </div>

      <button
        onClick={onBookEvent}
        className="mt-4 px-4 py-2  bg-green-600 text-white rounded"
      >
        Book Event
      </button>
      <p className="text-xs italic text-gray-500 text-right mt-4">
        Inquiry No: {inquiry.inquiryNumber}
      </p>
    </div>
  );
};

export default InquiryCard;
