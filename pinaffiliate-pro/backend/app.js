const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const { notFound, errorHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiters");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const pinRoutes = require("./routes/pins");
const boardRoutes = require("./routes/boards");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comments");
const analyticsRoutes = require("./routes/analytics");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use("/uploads", express.static(process.env.UPLOAD_DIR || "uploads"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "PinAffiliate Pro API is running" }));

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
