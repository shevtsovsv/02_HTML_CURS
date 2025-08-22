const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./models");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Подключаем маршруты
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const projectRoutes = require("./routes/project");
const authRoutes = require("./routes/auth");
const userCodeRoutes = require("./routes/userCode");
const userProgressRoutes = require("./routes/userProgress"); 
const stepRoutes = require("./routes/steps");

app.use("/api/user", userRoutes); // Все запросы /users будут обрабатываться маршрутом из users.js
app.use("/api/courses", courseRoutes); // Все запросы /courses будут обрабатываться маршрутом из users.js
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user-code", userCodeRoutes);
app.use("/api/progress", userProgressRoutes); 
app.use("/api/steps", stepRoutes);

app.get("/", (req, res) => res.send("API is running"));

// TODO: add routes here

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(async () => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`);
  });
});
