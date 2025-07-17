const mongoose = require('mongoose');
const { Schema } = mongoose;


const inquirySchema = new mongoose.Schema({
  inquiryNumber:{type:String,unique:true},
  customerName: String,
  HallType:String,
  eventTime:String,
  numberOfGuests:String,
  contactNumber: String,
  eventType: String,
  eventDate: String,
  followUpDate: String,
  inquiryStatus: {type: String, default: 'Follow-Up'},
  notes: String,
  createdAt:{type: Date, default: Date.now},
},{timestamps:true});

const Inquiry = mongoose.model("Inquiry",inquirySchema);
module.exports = Inquiry;
