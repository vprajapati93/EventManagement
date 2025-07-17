require('dotenv').config({path:'../.env'})
const mongoose = require('mongoose');
const connectDB = require('./db');
const app = require('./app.js');




connectDB()
.then(()=>{
    app.listen((process.env.PORT || 4000),()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('Error connecting to database',err)
})
