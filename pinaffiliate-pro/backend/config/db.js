const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set in .env");

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
    });

    console.log(`[db] MongoDB connected → ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("[db] connection error:", err.message);
    });
  } catch (err) {
    console.error(`[db] failed to connect: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
