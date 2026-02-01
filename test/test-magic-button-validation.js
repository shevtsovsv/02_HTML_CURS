/**
 * Тест для проверки валидации волшебной кнопки с let/const переменными
 */
const path = require("path");
const { JSDOM } = require(path.join(__dirname, "../server/node_modules/jsdom"));
const ValidationRulesCustom = require(
  path.join(__dirname, "../server/lib/validationRulesCustom"),
);

console.log("🧪 Тестирование валидации Magic Button с let/const переменными\n");

// Имитация кода из трех отдельных редакторов
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Волшебная кнопка</title>
</head>
<body>
  <div>
    <h1>Волшебная кнопка</h1>
    <p>Нажми на кнопку и увидишь магию!</p>
    <button class="magic-button" onclick="showMagic()">✨ Магия! ✨</button>
  </div>
</body>
</html>`;

const css = `
body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.magic-button {
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  color: white;
  padding: 20px 40px;
  border-radius: 50px;
}
`;

// Тест 1: с window.переменная (старый способ)
const jsWithWindow = `
window.clickCount = 0;
window.magicMessages = [
  "✨ Магия случилась!",
  "🎉 Вау! Это невероятно!",
  "🌟 Волшебство работает!",
  "🎊 Удивительно!"
];

function showMagic() {
  const randomIndex = Math.floor(Math.random() * magicMessages.length);
  const randomMessage = magicMessages[randomIndex];
  alert(randomMessage);
}
`;

// Тест 2: с let/const (новый способ)
const jsWithLetConst = `
let clickCount = 0;
const magicMessages = [
  "✨ Магия случилась!",
  "🎉 Вау! Это невероятно!",
  "🌟 Волшебство работает!",
  "🎊 Удивительно!"
];

function showMagic() {
  const randomIndex = Math.floor(Math.random() * magicMessages.length);
  const randomMessage = magicMessages[randomIndex];
  alert(randomMessage);
}
`;

// Правила валидации для шага 18
const rules = [
  { type: "variableExists", name: "magicMessages" },
  {
    type: "functionBodyIncludes",
    function: "showMagic",
    expected:
      "const randomIndex = Math.floor(Math.random() * magicMessages.length)",
  },
  {
    type: "functionBodyIncludes",
    function: "showMagic",
    expected: "alert(randomMessage)",
  },
];

function testValidation(testName, js) {
  console.log(`📋 ${testName}`);
  console.log("─".repeat(60));

  // Создаем полный HTML с CSS и JS
  let fullHTML = html;
  fullHTML = fullHTML.replace(/<\/head>/i, `<style>${css}</style></head>`);
  fullHTML = fullHTML.replace(/<\/body>/i, `<script>${js}</script></body>`);

  // Создаем JSDOM
  const dom = new JSDOM(fullHTML, {
    url: "http://localhost",
    referrer: "http://localhost",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000,
    runScripts: "dangerously",
  });
  const { document } = dom.window;

  // Создаем валидатор
  const validator = new ValidationRulesCustom(dom, document, html, css, js);

  // Проверяем правила
  const errors = [];
  for (const rule of rules) {
    const error = validator.validateRule(rule);
    if (error) {
      errors.push(error);
    }
  }

  // Выводим результат
  if (errors.length > 0) {
    console.log("❌ Валидация провалилась:");
    errors.forEach((err, idx) => {
      console.log(`   ${idx + 1}. ${err}`);
    });
  } else {
    console.log("✅ Валидация успешна!");
  }

  console.log("\n");
  return errors.length === 0;
}

// Запускаем тесты
const test1Passed = testValidation(
  "Тест 1: window.переменная (старый способ)",
  jsWithWindow,
);
const test2Passed = testValidation(
  "Тест 2: let/const (новый способ)",
  jsWithLetConst,
);

// Итоги
console.log("═".repeat(60));
console.log("📊 Результаты тестирования:");
console.log(`   Тест 1 (window): ${test1Passed ? "✅ PASSED" : "❌ FAILED"}`);
console.log(
  `   Тест 2 (let/const): ${test2Passed ? "✅ PASSED" : "❌ FAILED"}`,
);
console.log("═".repeat(60));

if (test1Passed && test2Passed) {
  console.log("\n🎉 Все тесты пройдены! Система поддерживает оба способа.");
  process.exit(0);
} else {
  console.log("\n⚠️  Есть проблемы с валидацией.");
  process.exit(1);
}
