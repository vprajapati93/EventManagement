const moment = require("moment");
const ApiError = require('../utils/ApiError.js')
const Inquiry = require('../models/inquiry.model.js');
const Booking = require('../models/Booking.model.js');
const Counter = require('../models/Counter.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const Mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler')


//Create the inquiry number incremented by one one value
async function getNextInquiryNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: "inquiry" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.value).padStart(4, "0"); 
  return `INQ-${padded}`;
}


const generateInquiry = asyncHandler( async(req,res)=>{
    const {customerName, contactNumber, eventDate, eventType, notes,HallType,numberOfGuests,eventTime} = req.body;
    const formattedTime = moment(req.body.eventTime, "HH:mm").format("hh:mm A");

    

     //generating the inquiry number
     const inquiryNumber = await getNextInquiryNumber();

     //generating the inquiry object
     const inquiry = await Inquiry.create({
          inquiryNumber,
          customerName,
          contactNumber,
          eventDate:new Date(eventDate),
          eventType,
          eventTime:formattedTime,
          HallType,
          numberOfGuests,
          notes
     })

     //Checking if the inquiry is successfully created or not if not then throw error.
     const createdInquiry = await Inquiry.findById(inquiry._id);

     if(!createdInquiry) {
          throw new ApiError(500, "Something went wrong while registering the inquiry")
     }

     
     return res.status(201).json(
          new ApiResponse(200,inquiry,"New Inquiry Created")
     )

})

const checkExisitingInquiry  = asyncHandler( async(req,res)=>{

     const {contactNumber} = req.params;
     const existingInquiry = await Inquiry.find({contactNumber:contactNumber})

     return res
     .status(200)
     .json(new ApiResponse(200,existingInquiry,"List of all the Inquiries"))
    
})

const slotAvailableForInquiryAtGivenDate = asyncHandler( async(req,res)=>{
     const { eventDate } = req.params; // or req.params/query depending on route
     // console.log(eventDate);

     // Create the beginning of the day (local time)
     const start = new Date(eventDate);
     start.setHours(0, 0, 0, 0);

     // Create the end of the day
     const end = new Date(eventDate);
     end.setHours(23, 59, 59, 999);
     const inquiresAtGivenDate = await Booking.find({
           eventDate: { $gte: start, $lt: end }
     });

     return res
     .status(200)
     .json(new ApiResponse(200,inquiresAtGivenDate,"Inquries at given Date"))
})

const fetchallInquires = asyncHandler(async(req,res)=>{
  
  const all = await Inquiry.find();

  if(!all){
    return res
    .status(404)
    .json(new ApiResponse(404, null, "No Inquries found"));
  }

    return res
    .status(201)
    .json(new ApiResponse(201,all, "List of all Inquries"));
})

module.exports = {
     generateInquiry,
     slotAvailableForInquiryAtGivenDate,
     checkExisitingInquiry,
     fetchallInquires
}