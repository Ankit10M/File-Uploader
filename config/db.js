const mongoose = require("mongoose");
const dns = require('dns');

dns.setServers(['8.8.8.8']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;