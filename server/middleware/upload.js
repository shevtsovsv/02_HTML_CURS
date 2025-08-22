const multer = require("multer");
const path = require("path");

// Настраиваем, куда и как сохранять файлы
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Папка для сохранения
  },
  filename: function (req, file, cb) {
    // Создаем уникальное имя файла, чтобы избежать конфликтов
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
