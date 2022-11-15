const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;
//moongoose connection is an event emitter that emits events when connection is ready or not
mongoose.connection.once('open',()=>{
    console.log("MongoDB connection ready");
});

mongoose.connection.on('error',(err)=>{
    console.error(err); 
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}