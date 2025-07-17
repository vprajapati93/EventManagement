const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new mongoose.Schema({
  customerName: String,
  email:String,
  HallType: String,
  contactNumber: String,
  eventType: String,
  eventDate: Date,
  eventTime:String,
  totalAmount: Number,
  amountPaid: Number,
  menu:String,         
  numberOfGuests: String,
  notes: String,
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  inquiryRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inquiry",
    default: null,
  },
  inquiryNumberSnapshot: {
    type: String,
    required: false
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});
bookingSchema.virtual("pendingAmount").get(function () {
  const total = this.totalAmount || 0;
  const paid = this.amountPaid || 0;
  return total - paid;
});

bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });


const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;

