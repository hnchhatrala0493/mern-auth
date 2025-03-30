import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(`${process.env.CONNECTION_STRING}`);
    console.log(
      "Database Successfully Connected:",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
