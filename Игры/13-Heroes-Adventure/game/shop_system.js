// Магазин и система ресурсов для Heroes Adventure
// Этот файл будет встроен в основную игру

const SHOP_ITEMS = {
  buildings: [
    {
      id: "watchtower",
      name: "🗼 Башня наблюдения",
      description: "Увеличивает радиус обзора на +2 тайла",
      cost: { stone: 5, wood: 3, gold: 200 },
      effect: "vision",
      value: 2,
    },
    {
      id: "healing_shrine",
      name: "⛩️ Лечебное святилище",
      description: "Восстанавливает 50 ОД в начале каждого хода",
      cost: { stone: 8, crystals: 2, gold: 500 },
      effect: "heal_per_turn",
      value: 50,
    },
    {
      id: "resource_mine",
      name: "⛏️ Шахта",
      description: "Приносит +5 камня каждый ход",
      cost: { wood: 10, gold: 300 },
      effect: "stone_income",
      value: 5,
    },
    {
      id: "lumber_mill",
      name: "🏭 Лесопилка",
      description: "Приносит +8 дерева каждый ход",
      cost: { stone: 6, gold: 250 },
      effect: "wood_income",
      value: 8,
    },
  ],
  equipment: [
    {
      id: "iron_sword",
      name: "⚔️ Железный меч",
      description: "Атака +5",
      cost: { gold: 300, stone: 2 },
      slot: "weapon",
      stats: { attack: 5 },
    },
    {
      id: "steel_armor",
      name: "🛡️ Стальная броня",
      description: "Защита +8",
      cost: { gold: 500, stone: 5 },
      slot: "armor",
      stats: { defense: 8 },
    },
    {
      id: "magic_ring",
      name: "💍 Кольцо силы",
      description: "Магия +3, Знания +2",
      cost: { gold: 800, crystals: 3 },
      slot: "accessory",
      stats: { magic: 3, knowledge: 2 },
    },
    {
      id: "hero_boots",
      name: "👢 Сапоги путешественника",
      description: "Макс. очки движения +25",
      cost: { gold: 400, wood: 5 },
      slot: "accessory",
      stats: { maxActionPoints: 25 },
    },
  ],
  magic: [
    {
      id: "teleport",
      name: "✨ Телепортация",
      description: "Мгновенно перемещает к любому исследованному городу",
      cost: { crystals: 3, gold: 100 },
      effect: "teleport",
    },
    {
      id: "reveal_map",
      name: "🔍 Видение карты",
      description: "Открывает большую область вокруг героя",
      cost: { crystals: 2, gold: 150 },
      effect: "reveal_area",
    },
    {
      id: "resource_boost",
      name: "💎 Превращение материи",
      description: "Превращает 10 дерева и камня в кристаллы",
      cost: { wood: 10, stone: 10 },
      effect: "convert_resources",
    },
    {
      id: "time_warp",
      name: "⏰ Искажение времени",
      description: "Восстанавливает все очки движения",
      cost: { crystals: 4, gold: 200 },
      effect: "restore_ap",
    },
  ],
  army: [
    {
      id: "warrior",
      name: "⚔️ Воин",
      description: "Увеличивает атаку на +2 за каждого воина",
      cost: { gold: 100, wood: 2 },
      effect: "attack_bonus",
      value: 2,
    },
    {
      id: "archer",
      name: "🏹 Лучник",
      description: "Дает шанс избежать урона от монстров",
      cost: { gold: 150, wood: 5 },
      effect: "damage_reduction",
      value: 0.1,
    },
    {
      id: "mage",
      name: "🧙‍♂️ Маг",
      description: "Увеличивает магию на +3 за каждого мага",
      cost: { gold: 200, crystals: 1 },
      effect: "magic_bonus",
      value: 3,
    },
  ],
};

function switchShopTab(tab) {
  gameState.currentShopTab = tab;
  updateShopDisplay();
}

function updateShopDisplay() {
  const content = document.getElementById("shopContent");
  const items = SHOP_ITEMS[gameState.currentShopTab];

  content.innerHTML = "";

  if (gameState.currentShopTab === "army") {
    const armyInfo = document.createElement("div");
    armyInfo.className = "army-info";
    armyInfo.innerHTML = `
            <div class="section-title">👥 Ваша армия</div>
            <div class="army-unit">⚔️ Воины: <span>${gameState.army.warriors}</span></div>
            <div class="army-unit">🏹 Лучники: <span>${gameState.army.archers}</span></div>
            <div class="army-unit">🧙‍♂️ Маги: <span>${gameState.army.mages}</span></div>
        `;
    content.appendChild(armyInfo);
  }

  items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "shop-item";

    const canAfford = checkResourceCost(item.cost);
    const costText = Object.keys(item.cost)
      .map((resource) => {
        const cost = item.cost[resource];
        const current = gameState.resources[resource] || 0;
        const enough = current >= cost;
        return `<span style="color: ${
          enough ? "#27AE60" : "#E74C3C"
        }">${getResourceIcon(resource)}${cost}</span>`;
      })
      .join(" ");

    itemDiv.innerHTML = `
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-description">${item.description}</div>
            <div class="shop-item-cost">
                <div class="cost-display">${costText}</div>
                <button class="shop-buy-btn" ${!canAfford ? "disabled" : ""} 
                        onclick="buyItem('${gameState.currentShopTab}', '${
      item.id
    }')">
                    ${
                      gameState.currentShopTab === "magic"
                        ? "Использовать"
                        : "Купить"
                    }
                </button>
            </div>
        `;

    content.appendChild(itemDiv);
  });
}

function getResourceIcon(resource) {
  const icons = {
    gold: "💰",
    stone: "🪨",
    wood: "🌳",
    crystals: "⚡",
  };
  return icons[resource] || "";
}

function checkResourceCost(cost) {
  return Object.keys(cost).every((resource) => {
    return (gameState.resources[resource] || 0) >= cost[resource];
  });
}

function payResourceCost(cost) {
  Object.keys(cost).forEach((resource) => {
    gameState.resources[resource] =
      (gameState.resources[resource] || 0) - cost[resource];
  });
}

function buyItem(category, itemId) {
  const item = SHOP_ITEMS[category].find((i) => i.id === itemId);
  if (!item || !checkResourceCost(item.cost)) return;

  payResourceCost(item.cost);
  applyItemEffect(category, item);

  showNotification(`Приобретено: ${item.name}`);
  updateUI();
  updateShopDisplay();
}

function applyItemEffect(category, item) {
  switch (category) {
    case "buildings":
      gameState.buildings.push({
        id: item.id,
        x: gameState.hero.x,
        y: gameState.hero.y,
        effect: item.effect,
        value: item.value,
      });

      if (item.effect === "vision") {
        revealArea(gameState.hero.x, gameState.hero.y, item.value + 1);
      }

      gameMap[gameState.hero.y][gameState.hero.x] = "BUILDING";
      break;

    case "equipment":
      const oldItem = gameState.hero.equipment[item.slot];
      if (oldItem) {
        Object.keys(oldItem.stats).forEach((stat) => {
          if (stat === "maxActionPoints") {
            gameState.hero.maxActionPoints -= oldItem.stats[stat];
          } else {
            gameState.hero.stats[stat] -= oldItem.stats[stat];
          }
        });
      }

      gameState.hero.equipment[item.slot] = item;

      Object.keys(item.stats).forEach((stat) => {
        if (stat === "maxActionPoints") {
          gameState.hero.maxActionPoints += item.stats[stat];
          gameState.hero.actionPoints += item.stats[stat];
        } else {
          gameState.hero.stats[stat] += item.stats[stat];
        }
      });
      break;

    case "magic":
      applyMagicEffect(item);
      break;

    case "army":
      const unitType = item.id;
      gameState.army[unitType + "s"] =
        (gameState.army[unitType + "s"] || 0) + 1;
      break;
  }
}

function applyMagicEffect(item) {
  switch (item.effect) {
    case "teleport":
      showTeleportDialog();
      break;

    case "reveal_area":
      revealArea(gameState.hero.x, gameState.hero.y, 5);
      showNotification("Большая область карты открыта!");
      break;

    case "convert_resources":
      gameState.resources.crystals += 2;
      showNotification("Материя превращена в 2 кристалла!");
      break;

    case "restore_ap":
      gameState.hero.actionPoints = gameState.hero.maxActionPoints;
      showNotification("Очки движения восстановлены!");
      break;
  }
}

function showTeleportDialog() {
  const towns = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (gameMap[y][x] === "TOWN" && !fogOfWar[y][x]) {
        towns.push({ x, y });
      }
    }
  }

  if (towns.length === 0) {
    showNotification("Нет исследованных городов для телепортации!");
    return;
  }

  const townNames = [
    "Форт Камень",
    "Деревня Лесная",
    "Город Золотой",
    "Крепость Магии",
  ];
  let dialogText = "Выберите город для телепортации:\n\n";

  towns.forEach((town, index) => {
    const name = townNames[index] || `Город ${index + 1}`;
    dialogText += `${index + 1}. ${name} (${town.x}, ${town.y})\n`;
  });

  const choice = prompt(dialogText + "\nВведите номер города:");
  const townIndex = parseInt(choice) - 1;

  if (townIndex >= 0 && townIndex < towns.length) {
    gameState.hero.x = towns[townIndex].x;
    gameState.hero.y = towns[townIndex].y;
    updateCamera();
    showNotification(
      `Телепортация в ${townNames[townIndex] || "город"} выполнена!`
    );
  }
}

function applyPassiveEffects() {
  gameState.buildings.forEach((building) => {
    switch (building.effect) {
      case "heal_per_turn":
        gameState.hero.actionPoints = Math.min(
          gameState.hero.maxActionPoints,
          gameState.hero.actionPoints + building.value
        );
        break;

      case "stone_income":
        gameState.resources.stone += building.value;
        break;

      case "wood_income":
        gameState.resources.wood += building.value;
        break;
    }
  });

  const stoneIncome = gameState.buildings
    .filter((b) => b.effect === "stone_income")
    .reduce((sum, b) => sum + b.value, 0);

  const woodIncome = gameState.buildings
    .filter((b) => b.effect === "wood_income")
    .reduce((sum, b) => sum + b.value, 0);

  if (stoneIncome > 0 || woodIncome > 0) {
    const incomeText = [];
    if (stoneIncome > 0) incomeText.push(`+${stoneIncome} 🪨`);
    if (woodIncome > 0) incomeText.push(`+${woodIncome} 🌳`);
    showNotification(`Доходы: ${incomeText.join(", ")}`);
  }
}

function calculateArmyBonuses() {
  let attackBonus = gameState.army.warriors * 2;
  let magicBonus = gameState.army.mages * 3;

  return {
    attack: attackBonus,
    magic: magicBonus,
    damageReduction: gameState.army.archers * 0.1,
  };
}
