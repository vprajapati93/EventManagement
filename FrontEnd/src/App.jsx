import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navigation from "./components/Navigation";
import Calendar from "react-Calendar";
import BookingForm from "./components/BookingForm";
import InquiryForm from "./components/InquiryForm";
import AdminDashboard from "./components/AdminDashboard";
import BookingDetailsPage from "./components/BookingDetailsPage"

function App() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [bookedDates, setBookedDates] = useState([]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-off-white-50 via-off-white-100 to-warm-beige-100">
        <Navigation  setShowCalendar={setShowCalendar} showCalendar={showCalendar} />
        {showCalendar && (
          <div className="fixed top-20 right-10 z-50 bg-white shadow-lg p-4 rounded-xl max-w-[320px]">
            <Calendar
              tileClassName={({ date }) => {
                const eventDates = bookedDates.map(d => new Date(d).toDateString());
                return eventDates.includes(date.toDateString())
                  ? "bg-red-400 rounded-full text-white"
                  : null;
              }}
            />
          </div>
        )}
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<AdminDashboard setBookedDates={setBookedDates} />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/inquiry" element={<InquiryForm />} />
            <Route path="/booking/:id" element={<BookingDetailsPage/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
