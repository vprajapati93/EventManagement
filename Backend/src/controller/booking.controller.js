const ApiError = require('../utils/ApiError.js');
const moment = require("moment");
const sendBookingReceipt = require('../utils/sendBookingReceipt.js');
const ApiResponse = require('../utils/ApiResponse.js');
const Mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler')
const Booking = require('../models/Booking.model.js');
const Inquiry = require('../models/inquiry.model.js');
const uploadOnCloudinary = require('../utils/cloudinary.js');


// Inquiy is done now the user want's to proceed with Booking
const createBookingFromInquiry = asyncHandler( async(req,res)=>{
  // console.log("req file",req.file);
    const bookingDate = new Date(req.body.eventDate);

    const formattedTime = moment(req.body.eventTime, "HH:mm").format("hh:mm A");


    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const inquiry = await Inquiry.findOne({ inquiryNumber: req.params.inquiryNumber });

    if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
    }

    const existingBooking = await Booking.findOne({ inquiryRef: inquiry._id });
    if (existingBooking) {
        return res.status(409).json({ message: "Booking already exists for this inquiry" });
    
    }
    const BookingWithGivenDate = await Booking.findOne({
      eventDate: { $gte: bookingDate, $lt: nextDay },
      status: { $ne: "cancelled" },
    });

    if (BookingWithGivenDate) {
      return res.status(409).json({ message: "Booking already exists for this date" });
    }

    const localPath = req.files?.menu?.[0]?.path ?? null;
    // console.log(localPath);
    const menu = await uploadOnCloudinary(localPath);
    // console.log("meni",menu);


    const{totalAmount,amountPaid} = req.body;
    // const pending = totalAmount - amountPaid;

    const booking = await Booking.create({
        customerName:req.body.customerName,
        email:req.body.email,
        eventType: req.body.eventType,
        numberOfGuests: req.body.numberOfGuests,
        contactNumber: req.body.contactNumber,
        eventDate: req.body.eventDate,
        eventTime: formattedTime,
        inquiryRef: inquiry._id,
        HallType:req.body.HallType,
        inquiryNumberSnapshot: inquiry.inquiryNumber,
        amountPaid: req.body.amountPaid,
        totalAmount: req.body.totalAmount,
        notes:req.body.notes,
        menu:menu?.url || ""
    });

    return res
         .status(200)
         .json(new ApiResponse(200,createBookingFromInquiry,"Booking Done"))
        

})

//Direct Booking no inquiry nothing user directly wants to do the booking
const generateBooking = asyncHandler(async(req,res)=>{
    const {
    customerName,
    email,
    eventType,
    numberOfGuests,
    contactNumber,
    eventDate,
    eventTime,
    HallType,
    totalAmount,
    amountPaid,
    notes} = req.body;

    const formattedTime = moment(req.body.eventTime, "HH:mm").format("hh:mm A");


  // Convert eventDate to Date object to check whether the booking is done for that date or not
  const bookingDate = new Date(eventDate);
  const nextDay = new Date(bookingDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // console.log(req.body);
  // Checking if any booking exist for that date or not
  const existingBooking = await Booking.findOne({
    eventDate: { $gte: bookingDate, $lt: nextDay },
    status: { $ne: "cancelled" },
  });


  if (existingBooking) {
    throw new ApiError(409, "Booking already exists for this date");
  }

  //Getting the file via middleware
  const localPath = req.files?.menu?.[0]?.path ?? null;

  
  // if(!localPath){
  //   throw new ApiError(400, "Menu File not found");
  // }

  const menu = await uploadOnCloudinary(localPath);

  // If no booking exist proceed with booking
  const booking = await Booking.create({
    customerName,
    email,
    eventType,
    numberOfGuests,
    contactNumber,
    eventDate:bookingDate,
    eventTime:formattedTime,
    HallType,
    totalAmount,
    amountPaid,
    notes,
    menu:menu?.url || ""
  });

    if (email) {
    await sendBookingReceipt(booking);
  }



  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
})


const updateBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const updates = { ...req.body }; // Clone to avoid mutation

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  const addAmt = Number(updates.additionalAmount);
  if (!isNaN(addAmt)) {
    booking.amountPaid = (booking.amountPaid || 0) + addAmt;
  }

  // Avoid accidental overwrites
  delete updates.additionalAmount;
  delete updates.amountPaid;

  // Apply rest of updates
  Object.keys(updates).forEach((key) => {
    booking[key] = updates[key];
  });

  await booking.save();
  res.status(200).json(new ApiResponse(200, booking, "Booking updated"));
});


//Cancel Booking using BookingID
const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json(new ApiResponse(404, null, "Booking not found"));
  }

  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

const isBookingAvailable = asyncHandler(async (req,res)=>{
  const { eventDate } = req.params;
  const existing = await Booking.findOne({ eventDate: new Date(eventDate),status: { $ne: "cancelled" } });

  if (existing) {
    return res.status(409).json({ available: false, message: "Date already booked" });
  }

  return res.json({ available: true });

})

//Fetch booking from booking ID
const getBookingByID = asyncHandler(async (req,res)=>{
  const { id } = req.params;
  const existing = await Booking.findById(id);

  if (!existing) {
    return res.status(409).json({ available: false, message: "Error Occured while fetching Booking" });
  }

  return res
    .status(200)
    .json(new ApiResponse(201,existing, "Booking"));

})

//List of all the up coming booking
const upComingBooking = asyncHandler( async(req,res)=>{

  const upComingBookings = await Booking.find({eventDate:{$gte:new Date()}}).sort({ eventDate: 1 });

  if(!upComingBookings){
    return res
    .status(404)
    .json(new ApiResponse(404, null, "No upcoming bookings found"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201,upComingBookings, "List of all Booking"));
  
})

//List of all the past booking
const passedBooking = asyncHandler(async(req,res)=>{

  const pastBookings = await Booking.find({eventDate:{$lt:new Date()}});

  if(!pastBookings){
    return res
    .status(404)
    .json(new ApiResponse(404, null, "No past bookings found"));
  }

    return res
    .status(201)
    .json(new ApiResponse(201,pastBookings, "List of all Booking"));
})

const fetchallbooking = asyncHandler(async(req,res)=>{
  
  const all = await Booking.find();

  if(!all){
    return res
    .status(404)
    .json(new ApiResponse(404, null, "No past bookings found"));
  }

    return res
    .status(200)
    .json(new ApiResponse(200,all, "List of all Booking"));
})


module.exports = {createBookingFromInquiry,
      generateBooking,
      updateBooking,
      upComingBooking,
      passedBooking,
      fetchallbooking,
      isBookingAvailable,
      getBookingByID,
      cancelBooking
    };



