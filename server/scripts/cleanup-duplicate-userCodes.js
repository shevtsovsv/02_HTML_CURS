/**
 * Скрипт для очистки дублирующихся записей в таблице userCodes
 */

const { sequelize, userCode } = require("../models");
const { Op } = require("sequelize");

async function cleanupDuplicates() {
  try {
    console.log("🔍 Поиск дублирующихся записей...");

    // Получаем все записи, сгруппированные по user_id, project_id, step_id
    const duplicates = await userCode.findAll({
      attributes: [
        "user_id",
        "project_id",
        "step_id",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("MIN", sequelize.col("id")), "minId"],
      ],
      group: ["user_id", "project_id", "step_id"],
      having: sequelize.where(
        sequelize.fn("COUNT", sequelize.col("id")),
        ">",
        1
      ),
    });

    console.log(`📊 Найдено ${duplicates.length} групп с дубликатами`);

    if (duplicates.length === 0) {
      console.log("✅ Дубликаты не найдены!");
      return;
    }

    let totalDeleted = 0;

    for (const duplicate of duplicates) {
      const { user_id, project_id, step_id, minId } = duplicate.dataValues;

      // Удаляем все записи кроме самой первой (с минимальным ID)
      const deleted = await userCode.destroy({
        where: {
          user_id,
          project_id,
          step_id,
          id: {
            [Op.gt]: minId,
          },
        },
      });

      totalDeleted += deleted;
      console.log(
        `🗑️  Удалено ${deleted} дубликатов для user ${user_id}, project ${project_id}, step ${step_id}`
      );
    }

    console.log(
      `✅ Очистка завершена! Всего удалено ${totalDeleted} дублирующихся записей.`
    );

    // Показываем итоговую статистику
    const totalRecords = await userCode.count();
    console.log(`📈 Итого записей в таблице: ${totalRecords}`);
  } catch (error) {
    console.error("❌ Ошибка при очистке дубликатов:", error);
  } finally {
    await sequelize.close();
  }
}

// Запускаем очистку
cleanupDuplicates();
