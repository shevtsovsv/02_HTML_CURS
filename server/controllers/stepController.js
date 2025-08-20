/**
 * @file controllers/stepController.js
 * @description Контроллер для CRUD-операций над шагами проекта (projectStep).
 */
const { projectStep } = require("../models");

// Создание нового шага
const createStep = async (req, res) => {
  try {
    // Мы ожидаем все данные, включая project_id, в теле запроса
    const { projectId, instructions, order, validationRules } = req.body;
    const newStep = await projectStep.create({
      project_id: projectId,
      instructions,
      order,
      validationRules,
    });
    res.status(201).json(newStep);
  } catch (error) {
    console.error("Ошибка при создании шага:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

// Обновление шага
const updateStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { instructions, order, validationRules } = req.body;
    const [updatedRows] = await projectStep.update(
      { instructions, order, validationRules },
      { where: { id } }
    );
    if (updatedRows > 0) {
      const updatedStep = await projectStep.findByPk(id);
      res.json(updatedStep);
    } else {
      res.status(404).json({ error: "Шаг не найден" });
    }
  } catch (error) {
    console.error("Ошибка при обновлении шага:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

// Удаление шага
const deleteStep = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await projectStep.destroy({ where: { id } });
    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Шаг не найден" });
    }
  } catch (error) {
    console.error("Ошибка при удалении шага:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

module.exports = { createStep, updateStep, deleteStep };
