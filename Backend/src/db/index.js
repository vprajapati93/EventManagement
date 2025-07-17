require('dotenv').config();
const mongoose = require('mongoose');
const { DB_NAME } = require('../constants.js');


const connectDB = async ()=>{
    
    try {
        console.log("Trying to connect db")
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("error occured",error);
        process.exit(1)
    }finally{
        console.log("db connected");
    }
    
}

module.exports = connectDB;