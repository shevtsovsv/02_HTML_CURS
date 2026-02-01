/**
 * Тест проверки onclick с функцией showMagic
 */
const path = require("path");
const { JSDOM } = require(path.join(__dirname, "../server/node_modules/jsdom"));
const ValidationRulesCustom = require(
  path.join(__dirname, "../server/lib/validationRulesCustom"),
);

console.log("🧪 Тестирование onclick для волшебной кнопки\n");

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
  "✨ Магия случилась!",
  "🎉 Вау! Это невероятно!",
  "🌟 Волшебство работает!",
  "🎊 Удивительно!"
];

function showMagic() {
  const randomIndex = Math.floor(Math.random() * magicMessages.length);
  const randomMessage = magicMessages[randomIndex];
  console.log("Alert вызван с:", randomMessage);
  // alert(randomMessage); // В JSDOM alert не работает
}
`;

// Функция обертывания из validationController
const wrapJavaScript = (jsCode) => {
  if (!jsCode) return "";

  // Находим все function declarations в коде
  const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
  const functionNames = [];
  let match;

  while ((match = functionRegex.exec(jsCode)) !== null) {
    functionNames.push(match[1]);
  }

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

const wrappedJS = wrapJavaScript(js);

// Создаем полный HTML так же, как в validationController
let fullHTML = html;
fullHTML = fullHTML.replace(/<\/head>/i, `<style>${css}</style></head>`);
fullHTML = fullHTML.replace(
  /<\/body>/i,
  `<script>${wrappedJS}</script></body>`,
);

console.log("📄 HTML для проверки:");
console.log(fullHTML);
console.log("\n" + "─".repeat(60) + "\n");

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

// Подключаем console.log
let lastConsoleLog = null;
dom.window.console.log = function (...args) {
  lastConsoleLog = args.join(" ");
  console.log("📢 Console.log из JSDOM:", ...args);
};

console.log("🔍 Проверка 1: Функция showMagic доступна в window?");
console.log(`   typeof window.showMagic = "${typeof dom.window.showMagic}"`);

if (typeof dom.window.showMagic === "function") {
  console.log("   ✅ Функция showMagic найдена в window!");
} else {
  console.log("   ❌ Функция showMagic НЕ найдена в window");

  // Пробуем через eval
  try {
    const fn = dom.window.eval("showMagic");
    console.log(`   🔄 Через eval: typeof showMagic = "${typeof fn}"`);
    if (typeof fn === "function") {
      console.log(
        "   ⚠️  Функция есть в scope, но НЕ в window - onclick не сработает!",
      );
    }
  } catch (e) {
    console.log("   ❌ Функция недоступна даже через eval:", e.message);
  }
}

console.log("\n🔍 Проверка 2: Переменная magicMessages доступна?");
console.log(
  `   typeof window.magicMessages = "${typeof dom.window.magicMessages}"`,
);

console.log("\n🔍 Проверка 3: Найдём кнопку и попробуем кликнуть");
const button = document.querySelector(".magic-button");

if (button) {
  console.log("   ✅ Кнопка найдена");
  console.log(`   onclick атрибут: "${button.getAttribute("onclick")}"`);

  try {
    console.log("\n🖱️  Эмулируем клик на кнопку...");
    button.click();

    if (lastConsoleLog && lastConsoleLog.includes("Alert вызван с:")) {
      console.log("   ✅ УСПЕХ! Функция showMagic вызвалась при клике!");
    } else {
      console.log("   ⚠️  Клик произошёл, но console.log не сработал");
    }
  } catch (error) {
    console.log("   ❌ ОШИБКА при клике:", error.message);
  }
} else {
  console.log("   ❌ Кнопка не найдена");
}

console.log("\n" + "═".repeat(60));
console.log("\n📊 Результат:");

if (typeof dom.window.showMagic === "function") {
  console.log("✅ Функция showMagic доступна глобально через window");
  console.log("✅ onclick должен работать");
  process.exit(0);
} else {
  console.log("❌ Функция showMagic НЕ доступна в window");
  console.log("❌ onclick НЕ будет работать");
  console.log("\n💡 Решение: Функции должны явно добавляться в window");
  process.exit(1);
}
