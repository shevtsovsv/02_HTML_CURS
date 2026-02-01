/*
  Универсальный адаптер рекламных платформ
  Поддерживает тестовые режимы всех популярных рекламных сетей
*/

class AdPlatformAdapter {
  constructor(config = {}) {
    this.config = {
      testMode: true,
      defaultDuration: 5000,
      platform: "demo", // demo, google, yandex, vk, mailru, meta
      debug: true,
      userType: "selfemployed", // selfemployed, physical, ip, company
      monthlyLimit: 200000, // для самозанятых - 2.4 млн в год
      ...config,
    };

    this.isInitialized = false;
    this.currentAd = null;

    if (this.config.debug) {
      console.log("🧪 AdPlatformAdapter инициализирован:", this.config);
    }
  }

  // Инициализация выбранной платформы
  async init() {
    try {
      switch (this.config.platform) {
        case "google":
          await this.initGoogleAds();
          break;
        case "yandex":
          await this.initYandexAds();
          break;
        case "vk":
          await this.initVKAds();
          break;
        case "mailru":
          await this.initMailRuAds();
          break;
        case "meta":
          await this.initMetaAds();
          break;
        default:
          await this.initDemoAds();
      }

      this.isInitialized = true;
      console.log(`✅ ${this.config.platform} реклама инициализирована`);
    } catch (error) {
      console.error(`❌ Ошибка инициализации ${this.config.platform}:`, error);
      // Fallback на демо-режим
      this.config.platform = "demo";
      await this.initDemoAds();
    }
  }

  // Google AdSense
  async initGoogleAds() {
    return new Promise((resolve) => {
      if (this.config.testMode) {
        // Загружаем тестовую версию
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.setAttribute("data-ad-client", "ca-pub-test");
        document.head.appendChild(script);

        script.onload = () => {
          console.log("🧪 Google AdSense тестовый режим загружен");
          resolve();
        };
      } else {
        // Продакшн версия
        console.log("🚀 Google AdSense продакшн режим (нужен реальный pub-id)");
        resolve();
      }
    });
  }

  // Яндекс.Директ
  async initYandexAds() {
    return new Promise((resolve) => {
      if (this.config.testMode) {
        // Загружаем тестовую версию Яндекс.Директ
        window.yaContextCb = window.yaContextCb || [];

        const script = document.createElement("script");
        script.src = "https://yandex.ru/ads/system/context.js";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          console.log("🧪 Яндекс.Директ тестовый режим загружен");
          resolve();
        };
      } else {
        console.log("🚀 Яндекс.Директ продакшн режим");
        resolve();
      }
    });
  }

  // VK Ads
  async initVKAds() {
    return new Promise((resolve) => {
      if (this.config.testMode) {
        // Загружаем VK SDK в тестовом режиме
        window.vkAsyncInit = function () {
          VK.init({
            apiId: "TEST_APP_ID",
            testMode: 1,
          });
          console.log("🧪 VK Ads тестовый режим загружен");
          resolve();
        };

        const script = document.createElement("script");
        script.src = "https://vk.com/js/api/openapi.js?169";
        script.async = true;
        document.head.appendChild(script);
      } else {
        console.log("🚀 VK Ads продакшн режим");
        resolve();
      }
    });
  }

  // Mail.ru Ads
  async initMailRuAds() {
    return new Promise((resolve) => {
      if (this.config.testMode) {
        // Симуляция Mail.ru SDK
        window.mailru = window.mailru || {};
        window.mailru.ads = window.mailru.ads || [];

        console.log("🧪 Mail.ru Ads тестовый режим загружен");
        resolve();
      } else {
        console.log("🚀 Mail.ru Ads продакшн режим");
        resolve();
      }
    });
  }

  // Meta Audience Network
  async initMetaAds() {
    return new Promise((resolve) => {
      if (this.config.testMode) {
        // Загружаем Facebook SDK в тестовом режиме
        window.fbAsyncInit = function () {
          FB.init({
            appId: "TEST_APP_ID",
            testMode: true,
            version: "v18.0",
          });
          console.log("🧪 Meta Audience Network тестовый режим загружен");
          resolve();
        };

        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/ru_RU/sdk.js";
        script.async = true;
        document.head.appendChild(script);
      } else {
        console.log("🚀 Meta Audience Network продакшн режим");
        resolve();
      }
    });
  }

  // Демо-реклама
  async initDemoAds() {
    console.log("🧪 Демо-реклама инициализирована");
    return Promise.resolve();
  }

  // Показать рекламу
  async showAd(callback) {
    if (!this.isInitialized) {
      await this.init();
    }

    // Проверяем доступность платформы для физлица
    if (!this.isPlatformAvailableForUser()) {
      console.warn(
        `⚠️ Платформа ${this.config.platform} недоступна для типа пользователя: ${this.config.userType}`
      );
      // Переключаемся на доступную платформу
      this.switchToAvailablePlatform();
    }

    console.log(`🎯 Показываем рекламу платформы: ${this.config.platform}`);

    switch (this.config.platform) {
      case "google":
        return this.showGoogleAd(callback);
      case "yandex":
        return this.showYandexAd(callback);
      case "vk":
        return this.showVKAd(callback);
      case "mailru":
        return this.showMailRuAd(callback);
      case "meta":
        return this.showMetaAd(callback);
      default:
        return this.showDemoAd(callback);
    }
  }

  // Проверка доступности платформы для типа пользователя
  isPlatformAvailableForUser() {
    const restrictions = {
      selfemployed: {
        available: ["vk", "google", "yandex", "meta", "demo"],
        unavailable: [], // все доступны!
        limited: {
          all: 2400000, // лимит самозанятости 2.4 млн/год
        },
      },
      physical: {
        available: ["vk", "google", "meta", "demo"],
        unavailable: ["yandex"], // требует ИП/ООО
        limited: {
          vk: 60000, // рублей в месяц
          mailru: 20000, // рублей в месяц
        },
      },
      ip: {
        available: ["vk", "google", "meta", "yandex", "mailru", "demo"],
        unavailable: [],
        limited: {},
      },
      company: {
        available: ["vk", "google", "meta", "yandex", "mailru", "demo"],
        unavailable: [],
        limited: {},
      },
    };

    const userRestrictions =
      restrictions[this.config.userType] || restrictions["selfemployed"];
    return userRestrictions.available.includes(this.config.platform);
  }

  // Переключение на доступную платформу
  switchToAvailablePlatform() {
    const availablePlatforms = {
      selfemployed: ["yandex", "vk", "google"], // все доступны!
      physical: ["vk", "google", "meta"],
      ip: ["yandex", "vk", "google"],
      company: ["yandex", "vk", "google"],
    };

    const available =
      availablePlatforms[this.config.userType] ||
      availablePlatforms["selfemployed"];
    const newPlatform = available[0];

    console.log(
      `🔄 Переключение с ${this.config.platform} на ${newPlatform} (доступно для ${this.config.userType})`
    );
    this.switchPlatform(newPlatform);
  }

  // Показать Google рекламу
  showGoogleAd(callback) {
    console.log("📱 Показ Google AdSense рекламы");

    // Создаем рекламный блок
    const adContainer = document.createElement("div");
    adContainer.id = "google-ad-container";
    adContainer.innerHTML = `
      <ins class="adsbygoogle"
           style="display:block; width:100%; height:250px;"
           data-ad-client="${
             this.config.testMode ? "ca-pub-test" : this.config.googleClientId
           }"
           data-ad-slot="${
             this.config.testMode ? "test-slot" : this.config.googleSlotId
           }"
           ${this.config.testMode ? 'data-adtest="on"' : ""}></ins>
    `;

    this.showAdModal(adContainer, callback, "Google AdSense");
  }

  // Показать Яндекс рекламу
  showYandexAd(callback) {
    console.log("📱 Показ Яндекс.Директ рекламы");

    const adContainer = document.createElement("div");
    adContainer.id = "yandex-ad-container";
    adContainer.style.width = "100%";
    adContainer.style.height = "250px";

    if (this.config.testMode) {
      adContainer.innerHTML = `
        <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); 
                    padding: 20px; border-radius: 10px; text-align: center; color: white;">
          <h3>🧪 Яндекс.Директ - Тестовая реклама</h3>
          <p>Изучите программирование с Яндекс.Практикум!</p>
          <p>Скидка 20% по промокоду TEST2024</p>
        </div>
      `;
    }

    this.showAdModal(adContainer, callback, "Яндекс.Директ");
  }

  // Показать VK рекламу
  showVKAd(callback) {
    console.log("📱 Показ VK Ads рекламы");

    const adContainer = document.createElement("div");
    adContainer.innerHTML = `
      <div style="background: linear-gradient(45deg, #4c75a3, #5d8ab8); 
                  padding: 20px; border-radius: 10px; text-align: center; color: white;">
        <h3>🧪 VK Ads - Тестовая реклама</h3>
        <p>Присоединяйтесь к IT-сообществу VK!</p>
        <p>Найдите работу мечты в технологиях</p>
      </div>
    `;

    this.showAdModal(adContainer, callback, "VK Ads");
  }

  // Показать Mail.ru рекламу
  showMailRuAd(callback) {
    console.log("📱 Показ Mail.ru рекламы");

    const adContainer = document.createElement("div");
    adContainer.innerHTML = `
      <div style="background: linear-gradient(45deg, #005bd1, #0073e6); 
                  padding: 20px; border-radius: 10px; text-align: center; color: white;">
        <h3>🧪 Mail.ru Ads - Тестовая реклама</h3>
        <p>Освойте Data Science с Mail.ru Group!</p>
        <p>Бесплатные курсы по машинному обучению</p>
      </div>
    `;

    this.showAdModal(adContainer, callback, "Mail.ru Ads");
  }

  // Показать Meta рекламу
  showMetaAd(callback) {
    console.log("📱 Показ Meta Audience Network рекламы");

    const adContainer = document.createElement("div");
    adContainer.innerHTML = `
      <div style="background: linear-gradient(45deg, #1877f2, #42a5f5); 
                  padding: 20px; border-radius: 10px; text-align: center; color: white;">
        <h3>🧪 Meta Ads - Тестовая реклама</h3>
        <p>Создавайте amazing apps с Meta!</p>
        <p>React, React Native, AI tools</p>
      </div>
    `;

    this.showAdModal(adContainer, callback, "Meta Audience Network");
  }

  // Показать демо рекламу
  showDemoAd(callback) {
    console.log("📱 Показ демо рекламы");

    const adContainer = document.createElement("div");
    adContainer.innerHTML = `
      <div style="background: linear-gradient(45deg, #667eea, #764ba2); 
                  padding: 20px; border-radius: 10px; text-align: center; color: white;">
        <h3>🧪 Демо реклама</h3>
        <p>🎯 Изучите веб-разработку с нашими курсами!</p>
        <p>💻 HTML, CSS, JavaScript - от основ до профи!</p>
        <p>🚀 Начните карьеру в IT уже сегодня!</p>
      </div>
    `;

    this.showAdModal(adContainer, callback, "Демо реклама");
  }

  // Универсальное модальное окно для рекламы
  showAdModal(adContainer, callback, platformName) {
    const modal = document.createElement("div");
    modal.className = "ad-modal-universal";
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); z-index: 1000; display: flex;
      align-items: center; justify-content: center;
    `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background: white; padding: 30px; border-radius: 20px;
      width: 90%; max-width: 500px; text-align: center;
      position: relative;
    `;

    modalContent.innerHTML = `
      <span style="position: absolute; top: 15px; right: 20px; font-size: 28px; 
                   cursor: pointer; color: #aaa;" onclick="this.parentElement.parentElement.remove()">×</span>
      <h3 style="color: #333; margin-bottom: 20px;">📢 ${platformName}</h3>
      <div id="ad-content-container"></div>
      <div style="margin-top: 20px; color: #666;">
        Реклама закроется через <span id="ad-timer-universal">${
          this.config.defaultDuration / 1000
        }</span> секунд
      </div>
      <button id="skip-ad-universal" disabled style="
        background: #ccc; color: white; border: none; padding: 10px 25px;
        border-radius: 25px; margin-top: 15px; cursor: not-allowed;
      ">Пропустить рекламу</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Вставляем рекламный контент
    document.getElementById("ad-content-container").appendChild(adContainer);

    // Запускаем таймер
    this.startAdTimer(callback, modal);
  }

  // Таймер рекламы
  startAdTimer(callback, modal) {
    let timeLeft = this.config.defaultDuration / 1000;
    const timer = document.getElementById("ad-timer-universal");
    const skipBtn = document.getElementById("skip-ad-universal");

    const interval = setInterval(() => {
      timeLeft--;
      if (timer) timer.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(interval);
        if (skipBtn) {
          skipBtn.disabled = false;
          skipBtn.style.background = "linear-gradient(45deg, #ff6b6b, #ffa500)";
          skipBtn.style.cursor = "pointer";
          skipBtn.textContent = "Продолжить";
          skipBtn.onclick = () => {
            modal.remove();
            callback();
          };
        }
      }
    }, 1000);
  }

  // Переключить платформу
  switchPlatform(platform) {
    this.config.platform = platform;
    this.isInitialized = false;
    console.log(`🔄 Переключено на платформу: ${platform}`);
  }

  // Включить/выключить тестовый режим
  setTestMode(enabled) {
    this.config.testMode = enabled;
    this.isInitialized = false;
    console.log(`🧪 Тестовый режим: ${enabled ? "включен" : "выключен"}`);
  }

  // Установить тип пользователя
  setUserType(userType) {
    const validTypes = ["selfemployed", "physical", "ip", "company"];
    if (!validTypes.includes(userType)) {
      console.error(
        `❌ Неверный тип пользователя. Доступные: ${validTypes.join(", ")}`
      );
      return;
    }

    this.config.userType = userType;
    console.log(`👤 Тип пользователя: ${userType}`);

    // Показываем доступные платформы
    this.showAvailablePlatforms();
  }

  // Показать доступные платформы для текущего типа пользователя
  showAvailablePlatforms() {
    const platformInfo = {
      selfemployed: {
        available: ["ВСЕ ПЛАТФОРМЫ! (VK, Яндекс, Google, Meta)"],
        unavailable: [],
        tax: "6% НПД (с рекламных платформ как с юрлиц)",
        limits: "До 2.4 млн руб/год (лимит самозанятости)",
        benefits: [
          "Автоматические чеки",
          "Простая отчетность",
          "Низкие налоги",
        ],
      },
      physical: {
        available: ["VK Ads (до 60к руб/мес)", "Google AdSense", "Meta Ads"],
        unavailable: ["Яндекс.Директ (нужно ИП)"],
        tax: "13% НДФЛ",
        limits: "Разные по платформам",
        benefits: ["Простота", "Не нужна регистрация"],
      },
      ip: {
        available: ["Все платформы доступны"],
        unavailable: [],
        tax: "6% УСН (доходы) или 15% УСН (доходы-расходы)",
        limits: "Без ограничений",
        benefits: ["Максимум возможностей", "Налоговые вычеты"],
      },
      company: {
        available: ["Все платформы + корпоративные тарифы"],
        unavailable: [],
        tax: "6% УСН или 20% налог на прибыль",
        limits: "Без ограничений",
        benefits: ["Корпоративные договоры", "Максимальные объемы"],
      },
    };

    const info = platformInfo[this.config.userType];
    console.log(`📋 Доступно для ${this.config.userType}:`, info.available);
    if (info.unavailable.length > 0) {
      console.log(`❌ Недоступно:`, info.unavailable);
    }
    console.log(`💰 Налогообложение: ${info.tax}`);
    console.log(`📊 Лимиты: ${info.limits}`);
    console.log(`✅ Преимущества:`, info.benefits);
  }
}

// Экспортируем для использования
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdPlatformAdapter;
} else {
  window.AdPlatformAdapter = AdPlatformAdapter;
}

// Создаем глобальный экземпляр для тестирования
window.adAdapter = new AdPlatformAdapter({
  testMode: true,
  platform: "demo",
  debug: true,
  userType: "selfemployed", // По умолчанию самозанятый
});

// Функции для быстрого тестирования платформ
window.testPlatforms = {
  google: () => {
    window.adAdapter.switchPlatform("google");
    return window.adAdapter.showAd(() =>
      console.log("✅ Google реклама завершена")
    );
  },

  yandex: () => {
    window.adAdapter.switchPlatform("yandex");
    return window.adAdapter.showAd(() =>
      console.log("✅ Яндекс реклама завершена")
    );
  },

  vk: () => {
    window.adAdapter.switchPlatform("vk");
    return window.adAdapter.showAd(() =>
      console.log("✅ VK реклама завершена")
    );
  },

  mailru: () => {
    if (window.adAdapter.config.userType === "physical") {
      console.warn("⚠️ Mail.ru ограничен для физлиц (до 20к руб/мес)");
    }
    window.adAdapter.switchPlatform("mailru");
    return window.adAdapter.showAd(() =>
      console.log("✅ Mail.ru реклама завершена")
    );
  },

  meta: () => {
    window.adAdapter.switchPlatform("meta");
    return window.adAdapter.showAd(() =>
      console.log("✅ Meta реклама завершена")
    );
  },

  demo: () => {
    window.adAdapter.switchPlatform("demo");
    return window.adAdapter.showAd(() =>
      console.log("✅ Демо реклама завершена")
    );
  },
};

// Функции управления типом пользователя
window.setUserType = (type) => {
  window.adAdapter.setUserType(type);
};

window.showTaxCalculator = () => {
  const monthlyIncome = prompt(
    "Введите ожидаемый месячный доход с рекламы (руб):",
    "50000"
  );
  if (!monthlyIncome) return;

  const monthly = parseInt(monthlyIncome);
  const annual = monthly * 12;

  console.log("\n💰 КАЛЬКУЛЯТОР НАЛОГОВ:");
  console.log(`📊 Месячный доход: ${monthly.toLocaleString()} руб`);
  console.log(`📊 Годовой доход: ${annual.toLocaleString()} руб`);

  // Самозанятый
  const selfEmployedTax = annual * 0.06; // 6% с рекламных платформ
  console.log(`\n👨‍💼 САМОЗАНЯТЫЙ (НПД):`);
  console.log(`   Налог 6%: ${selfEmployedTax.toLocaleString()} руб/год`);
  console.log(
    `   Остается: ${(annual - selfEmployedTax).toLocaleString()} руб`
  );
  console.log(`   Лимит: до 2.4 млн руб/год`);
  console.log(`   Отчетность: автоматическая через "Мой налог"`);

  // Физлицо
  const physicalTax = annual * 0.13;
  console.log(`\n👤 ФИЗИЧЕСКОЕ ЛИЦО:`);
  console.log(`   Налог НДФЛ 13%: ${physicalTax.toLocaleString()} руб/год`);
  console.log(`   К доплате до 15 июля: ${physicalTax.toLocaleString()} руб`);
  console.log(`   Остается: ${(annual - physicalTax).toLocaleString()} руб`);

  // ИП УСН Доходы
  const ipTaxIncome = Math.max(annual * 0.06, annual * 0.01); // минимум 1%
  const ipInsurance = 45000; // примерные взносы
  const ipTotal = ipTaxIncome + ipInsurance;
  console.log(`\n💼 ИП УСН "ДОХОДЫ" 6%:`);
  console.log(`   Налог: ${ipTaxIncome.toLocaleString()} руб/год`);
  console.log(`   Взносы: ${ipInsurance.toLocaleString()} руб/год`);
  console.log(`   Всего: ${ipTotal.toLocaleString()} руб/год`);
  console.log(`   Остается: ${(annual - ipTotal).toLocaleString()} руб`);

  // Сравнение и рекомендации
  const results = [
    {
      type: "Самозанятый",
      tax: selfEmployedTax,
      net: annual - selfEmployedTax,
    },
    { type: "Физлицо", tax: physicalTax, net: annual - physicalTax },
    { type: "ИП УСН", tax: ipTotal, net: annual - ipTotal },
  ];

  results.sort((a, b) => b.net - a.net);

  console.log(`\n🏆 РЕЙТИНГ ВЫГОДНОСТИ:`);
  results.forEach((result, index) => {
    const place = ["🥇", "🥈", "🥉"][index] || "📊";
    console.log(
      `   ${place} ${result.type}: ${result.net.toLocaleString()} руб на руки`
    );
  });

  // Персональная рекомендация
  if (annual <= 2400000) {
    console.log(
      `\n✅ РЕКОМЕНДАЦИЯ: При доходе ${annual.toLocaleString()} руб/год оптимально быть САМОЗАНЯТЫМ`
    );
    console.log(`   📱 Регистрация через приложение "Мой налог" за 5 минут`);
    console.log(`   🎯 Все рекламные платформы доступны`);
    console.log(
      `   💡 Экономия vs физлицо: ${(
        physicalTax - selfEmployedTax
      ).toLocaleString()} руб/год`
    );
  } else {
    console.log(
      `\n⚠️ ВНИМАНИЕ: Доход ${annual.toLocaleString()} руб превышает лимит самозанятости (2.4 млн)`
    );
    console.log(`   ✅ Рекомендуется переход на ИП УСН`);
  }
};

console.log(`
🎯 Универсальный адаптер рекламных платформ загружен!
�‍💼 Текущий статус: САМОЗАНЯТЫЙ (НПД)

📋 Доступные команды (ВСЕ ПЛАТФОРМЫ!):
  testPlatforms.yandex()  - ✅ Тест Яндекс.Директ
  testPlatforms.vk()      - ✅ Тест VK Ads
  testPlatforms.google()  - ✅ Тест Google AdSense  
  testPlatforms.meta()    - ✅ Тест Meta Audience Network
  testPlatforms.demo()    - ✅ Тест демо рекламы

🔧 Управление статусом:
  setUserType('selfemployed') - 👨‍💼 Самозанятый (рекомендуется!)
  setUserType('physical')     - 👤 Физическое лицо
  setUserType('ip')          - 💼 Индивидуальный предприниматель  
  setUserType('company')     - 🏢 ООО/АО
  
💰 Калькулятор налогов:
  showTaxCalculator()     - Сравнение всех вариантов налогообложения

📊 Преимущества самозанятого:
  💵 6% налог (vs 13% физлицо)
  📱 Автоматическая отчетность
  🎯 Все рекламные платформы доступны
  💰 Лимит до 2.4 млн руб/год
`);
