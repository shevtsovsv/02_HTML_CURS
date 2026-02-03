/**
 * Скрипт для обновления правил валидации шагов 23 и 25
 */
const { projectStep } = require("../models");

async function updateSteps() {
  try {
    // Проверим все проекты
    const { project } = require("../models");
    const allProjects = await project.findAll({
      attributes: ["id", "title"],
    });

    console.log("🎯 Все проекты в БД:");
    allProjects.forEach((p) => {
      console.log(`  ID ${p.id}: ${p.title}`);
    });
    console.log();

    // Сначала выведем все шаги
    const allSteps = await projectStep.findAll({
      where: { project_id: 54 },
      attributes: ["id", "order", "instructions"],
      order: [["order", "ASC"]],
    });

    console.log("📋 Найденные шаги для проекта 54 (Волшебная кнопка):");
    allSteps.forEach((s) => {
      const preview = s.instructions.substring(0, 60).replace(/\n/g, " ");
      console.log(`  Шаг ${s.order}: ${preview}... (ID: ${s.id})`);
    });
    console.log();

    // ========== Обновляем шаг 23 ==========
    const step23 = await projectStep.findOne({
      where: {
        project_id: 54,
        order: 23,
      },
    });

    if (!step23) {
      console.error("❌ Шаг 23 не найден");
    } else {
      console.log("✅ Найден шаг 23");
      console.log(
        "📋 Инструкция:",
        step23.instructions.substring(0, 100) + "...",
      );
      console.log(
        "📋 Старые правила:",
        JSON.stringify(step23.validationRules, null, 2),
      );

      const newRules23 = [
        {
          type: "functionBodyIncludes",
          function: "showMagic",
          expected: [
            "document.getElementById('clickCounter').innerHTML",
            "document.getElementById('clickCounter').innerText",
            "document.getElementById('clickCounter').textContent",
            "document.querySelector('#clickCounter').innerHTML",
            "document.querySelector('#clickCounter').innerText",
            "document.querySelector('#clickCounter').textContent",
            "clickCounter.innerHTML",
            "clickCounter.innerText",
            "clickCounter.textContent",
          ],
        },
        {
          type: "functionBodyIncludes",
          function: "showMagic",
          expected: "clickCount",
        },
      ];

      await step23.update({
        validationRules: newRules23,
      });

      console.log("\n✅ Правила валидации для шага 23 обновлены!");
    }

    // ========== Обновляем шаг 25 ==========
    const step25 = await projectStep.findOne({
      where: {
        project_id: 54,
        order: 25,
      },
    });

    if (!step25) {
      console.error("\n❌ Шаг 25 не найден");
    } else {
      console.log("\n✅ Найден шаг 25");
      console.log(
        "📋 Инструкция:",
        step25.instructions.substring(0, 100) + "...",
      );
      console.log(
        "📋 Старые правила:",
        JSON.stringify(step25.validationRules, null, 2),
      );

      const newRules25 = [
        {
          type: "functionBodyIncludes",
          function: "showMagic",
          expected: [
            "document.getElementById('magicMessage').innerHTML",
            "document.getElementById('magicMessage').innerText",
            "document.getElementById('magicMessage').textContent",
            "document.querySelector('#magicMessage').innerHTML",
            "document.querySelector('#magicMessage').innerText",
            "document.querySelector('#magicMessage').textContent",
            "magicMessage.innerHTML",
            "magicMessage.innerText",
            "magicMessage.textContent",
          ],
        },
        {
          type: "functionBodyIncludes",
          function: "showMagic",
          expected: "magicMessages",
        },
      ];

      await step25.update({
        validationRules: newRules25,
      });

      console.log("\n✅ Правила валидации для шага 25 обновлены!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  }
}

updateSteps();
