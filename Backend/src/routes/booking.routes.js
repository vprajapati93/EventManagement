const {createBookingFromInquiry,
    generateBooking,
    updateBooking,
    upComingBooking,
    fetchallbooking,
    cancelBooking,
    getBookingByID,
    isBookingAvailable,
    passedBooking,
}  = require('../controller/booking.controller')
const upload = require('../middleware/multer.middleware');
// const Router = require('express');
const express = require('express');
const router = express.Router();



router.route("/bookingfromInquiry/:inquiryNumber").post(upload.fields([{name:"menu",maxCount:3}]),createBookingFromInquiry);
router.route("/directBooking").post(upload.fields([{name:"menu",maxCount:3}]) ,generateBooking);
router.route('/update/:id').put(updateBooking);
router.route('/cancel/:id').patch(cancelBooking);
router.route('/booking/:id').get(getBookingByID);
router.route("/upcomingbooking").get(upComingBooking);
router.route("/isBookingAvailable/:eventDate").get(isBookingAvailable);
router.route("/passedbooking").get(passedBooking);
router.route("/fetchallbooking").get(fetchallbooking);

module.exports = router;








