const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("Connection string:", process.env.CONNECTION_STRING ? "Found" : "Missing");
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "✅ Database connected successfully!",
      "\nHost:", connect.connection.host,
      "\nDatabase:", connect.connection.name,
      "\nReady state:", connect.connection.readyState
    );
  } catch (err) {
    console.log("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDb;
