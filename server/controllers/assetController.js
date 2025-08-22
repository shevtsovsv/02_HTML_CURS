const { ProjectAsset } = require("../models");

const uploadAsset = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "Файл не был загружен" });
    }

    // Формируем URL, по которому файл будет доступен
    const fileUrl = `/uploads/${req.file.filename}`;

    const newAsset = await ProjectAsset.create({
      project_id: projectId,
      file_url: fileUrl,
      file_name: req.file.originalname,
    });

    res.status(201).json(newAsset);
  } catch (error) {
    console.error("Ошибка при загрузке ассета:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

module.exports = { uploadAsset };
