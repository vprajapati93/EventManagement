const express = require('express');
const cors = require('cors');
// const cookieParser = require('cookie-parser');


const app = express();
app.use(cors({
    // used to allowing the IP'S whitlisting the IP
    origin: process.env.CORS_ORIGIN
}))

//this means i'm accepting the json obj as input
app.use(express.json({limit:"50kb"}));
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}));
//to store the incoming file in public directory   
// app.use(express.static("public"))
// app.use(cookieParser())

//routes import 
const inquiry = require('./routes/inquiry.routes.js');
const booking = require('./routes/booking.routes.js');
//const googleAuthRoutes = require("./routes/googleauth.route.js");

// this mean if anyone goes on /users it will pass the control to userRoutes 
// so we have to go in userRoutes to check what will happen next URL eg: localhost:8000/api/v1/users/register   
app.use('/api/v1/inquiry',inquiry);
app.use('/api/v1/booking',booking);
// app.use("/api/v1/google", googleAuthRoutes);



module.exports = app;