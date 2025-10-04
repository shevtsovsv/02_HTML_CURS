const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./models");

const app = express();

// Security and middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

// Body parser with limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use("/uploads", express.static("public/uploads"));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Подключаем маршруты
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const projectRoutes = require("./routes/project");
const authRoutes = require("./routes/auth");
const userCodeRoutes = require("./routes/userCode");
const userProgressRoutes = require("./routes/userProgress"); 
const stepRoutes = require("./routes/steps");
const validationRoutes = require("./routes/validation");

app.use("/api/user", userRoutes); // Все запросы /users будут обрабатываться маршрутом из users.js
app.use("/api/courses", courseRoutes); // Все запросы /courses будут обрабатываться маршрутом из users.js
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user-code", userCodeRoutes);
app.use("/api/progress", userProgressRoutes); 
app.use("/api/steps", stepRoutes);
app.use("/api/validation", validationRoutes);

app.get("/", (req, res) => res.send("API is running"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(async () => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`);
  });
});
