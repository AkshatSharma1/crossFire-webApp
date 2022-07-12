// Used to connect to db
const dotenv = require('dotenv')
const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const connec = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, //for allowing new express parser
            useUnifiedTopology: true, 
        });

        console.log(`MongoDB connected: ${connec.connection.host}`);
    }

    catch(error){
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;