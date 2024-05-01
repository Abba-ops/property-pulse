import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  // Set mongoose options
  mongoose.set("strictQuery", true);

  // Check if the connection is already established
  if (connected) {
    console.log("MongoDB connection is already established");
    return;
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    connected = true;
    console.log("MongoDB connection established");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default connectDB;
