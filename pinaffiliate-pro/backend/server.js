require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] PinAffiliate Pro API listening on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });
};

start();

process.on("unhandledRejection", (err) => {
  console.error(`[server] Unhandled rejection: ${err.message}`);
});
