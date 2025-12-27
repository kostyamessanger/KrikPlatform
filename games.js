// games.js
// Платформа «Крик»: менеджер игр и ресурсов


class GameManager {
  constructor() {
    this.games = new Map(); // Хранилище игр: id → конфигурация
    this.loadedAssets = new Set(); // Загруженные ресурсы (URL)
    this.isInitialized = false;
  }

  // Инициализация менеджера (вызвать при старте платформы)
  async init() {
    if (this.isInitialized) return;
    
    console.log("Инициализация GameManager...");
    
    // Здесь можно загрузить games.json с CDN
    try {
      const response = await fetch(
        'https://cdn.jsdelivr.net/gh/ваш-аккаунт/krik-games@main/games.json'
      );
      const gameList = await response.json();
      
      gameList.forEach(game => this.registerGame(game.id, game));
      this.isInitialized = true;
      console.log("GameManager готов к работе.");
    } catch (error) {
      console.error("Не удалось загрузить список игр:", error);
    }
  }

  // Регистрация игры
  registerGame(id, config) {
    this.games.set(id, {
      title: config.title,
      description: config.description,
      assets: config.assets || [], // Массив URL ресурсов
      entryPoint: config.entryPoint, // Главный скрипт игры
      minPlayers: config.minPlayers || 1,
      maxPlayers: config.maxPlayers || 1,
      preview: config.preview || null // URL миниатюры
    });
  }

  // Загрузка ресурсов игры (скрипты, изображения, CSS)
  async loadGameResources(gameId) {
    const game = this.games.get(gameId);
    if (!game) throw new Error(`Игра "${gameId}" не найдена`);

    console.log(`Загружаем ресурсы для "${game.title}"...`);

    try {
      for (const assetUrl of game.assets) {
        if (this.loadedAssets.has(assetUrl)) continue;

        await this.loadAsset(assetUrl);
        this.loadedAssets.add(assetUrl);
      }
      console.log("Ресурсы загружены.");
      return true;
    } catch (error) {
      console.error("Ошибка загрузки ресурсов:", error);
      return false;
    }
  }

  // Загрузка отдельного ресурса
  async loadAsset(url) {
    return new Promise((resolve, reject) => {
      if (url.endsWith('.js')) {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Не удалось загрузить ${url}`));
        document.head.appendChild(script);
      } else if (url.endsWith('.css')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = resolve;
        link.onerror = () => reject(new Error(`Не удалось загрузить ${url}`));
        document.head.appendChild(link);
      } else {
        // Для изображений, шрифтов и др.
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = () => reject(new Error(`Не удалось загрузить ${url}`));
      }
    });
  }

  // Запуск игры (подключение главного скрипта)
  async startGame(gameId) {
    const game = this.games.get(gameId);
    if (!game) throw new Error(`Игра "${gameId}" не зарегистрирована`);

    // Загружаем ресурсы
    if (!(await this.loadGameResources(gameId))) {
      alert("Не удалось загрузить игру. Проверьте интернет-соединение.");
      return;
    }

    // Подключаем главный скрипт
    const script = document.createElement('script');
    script.src = game.entryPoint;
    script.type = 'module'; // Для ES6-модулей
    script.onload = () => {
      console.log(`${game.title} запущена!`);
      // Здесь можно вызвать инициализацию игры, например: window.initGame();
    };
    script.onerror = () => {
      alert(`Ошибка загрузки игры "${game.title}".`);
    };
    document.body.appendChild(script);
  }

  // Получить список всех игр
  getGameList() {
    return Array.from(this.games.entries()).map(([id, game]) => ({
      id,
      title: game.title,
      description: game.description,
      players: `${game.minPlayers}–${game.maxPlayers}`,
      preview: game.preview
    }));
  }
}

// Экземпляр менеджера
const GameManagerInstance = new GameManager();

// Экспорт для использования в других модулях (если нужно)
export default GameManagerInstance;

// Автоинициализация при загрузке модуля
(async () => {
  await GameManagerInstance.init();
})();
      
