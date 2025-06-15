const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

// Подключаем маршруты
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const projectRoutes = require("./routes/project");
app.use("/user", userRoutes); // Все запросы /users будут обрабатываться маршрутом из users.js
app.use("/course", courseRoutes); // Все запросы /courses будут обрабатываться маршрутом из users.js
app.use("/project", projectRoutes);

app.get("/", (req, res) => res.send("API is running"));

// TODO: add routes here

const PORT = process.env.PORT || 5000;

// async function start() {
//   try {
//     await sequelize.sync({ alter: true });
//     app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//   } catch (err) {
//     console.error(err);
//   }
// }

// start();
db.sequelize.sync().then(async () => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`);
  });
});
