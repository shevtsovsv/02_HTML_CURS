/**
 * Тест реального POST запроса к /api/validation/check/:stepId
 */
const path = require("path");

// Симулируем реальный запрос
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
`;

const js = `
let clickCount = 0;
const magicMessages = [
  "text1",
  "text2",
  "text3",
  "text4"
];

function showMagic() {
  const randomIndex = Math.floor(Math.random() * magicMessages.length);
  const randomMessage = magicMessages[randomIndex];
  alert(randomMessage);
}
`;

console.log("🧪 Симуляция реального запроса валидации\n");

// Импортируем код из validationController
const { JSDOM } = require(path.join(__dirname, "../server/node_modules/jsdom"));

// Копируем функцию wrapJavaScript из validationController
const wrapJavaScript = (jsCode) => {
  if (!jsCode) return "";

  // Находим все function declarations в коде
  const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
  const functionNames = [];
  let match;

  while ((match = functionRegex.exec(jsCode)) !== null) {
    functionNames.push(match[1]);
  }

  console.log("🔍 Найденные функции:", functionNames);

  // Создаем код, который делает функции глобальными
  let globalAssignments = "";
  if (functionNames.length > 0) {
    globalAssignments = "\n// Делаем функции доступными для onclick\n";
    functionNames.forEach((name) => {
      globalAssignments += `if (typeof ${name} !== 'undefined') window.${name} = ${name};\n`;
    });
  }

  return jsCode + globalAssignments;
};

// Создаем fullHTML так же как в validationController
let fullHTML;

if (html && html.trim().toLowerCase().startsWith("<!doctype")) {
  fullHTML = html;
  if (css) {
    fullHTML = fullHTML.replace(/<\/head>/i, `<style>${css}</style></head>`);
  }
  if (js) {
    const wrappedJS = wrapJavaScript(js);
    console.log("\n📦 Обернутый JavaScript:");
    console.log("─".repeat(60));
    console.log(wrappedJS);
    console.log("─".repeat(60) + "\n");

    fullHTML = fullHTML.replace(
      /<\/body>/i,
      `<script>${wrappedJS}</script></body>`,
    );
  }
}

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

console.log("✅ DOM создан");

// Проверяем window.showMagic
console.log("\n🔍 Проверка window.showMagic:");
console.log(`   typeof window.showMagic = "${typeof dom.window.showMagic}"`);

if (typeof dom.window.showMagic === "function") {
  console.log("   ✅ showMagic доступна в window!");

  // Пробуем кликнуть
  const button = document.querySelector(".magic-button");
  if (button) {
    console.log("\n🖱️  Кликаем на кнопку...");
    try {
      button.click();
      console.log("   ✅ Клик успешен, ошибок нет!");
    } catch (error) {
      console.log("   ❌ ОШИБКА при клике:", error.message);
    }
  }
} else {
  console.log("   ❌ showMagic НЕ доступна в window!");
  console.log("\n💡 Смотрим, что есть в window:");

  // Ищем функцию через eval
  try {
    const fn = dom.window.eval("showMagic");
    console.log(`   Через eval: typeof showMagic = "${typeof fn}"`);
    if (typeof fn === "function") {
      console.log("   ⚠️  Функция есть в scope, но НЕ в window!");
      console.log("   ⚠️  Нужно явно добавить: window.showMagic = showMagic");
    }
  } catch (e) {
    console.log("   ❌ Даже через eval не найдена:", e.message);
  }
}

console.log("\n" + "═".repeat(60));

if (typeof dom.window.showMagic === "function") {
  console.log("✅ ТЕСТ ПРОЙДЕН: onclick должен работать");
  process.exit(0);
} else {
  console.log("❌ ТЕСТ ПРОВАЛЕН: onclick НЕ будет работать");
  process.exit(1);
}
