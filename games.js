// games.js
// Платформа «Крик»: менеджер игр


class GameManager {
  constructor() {
    this.games = {}; // Хранилище игр: id → конфигурация
  }

  // Регистрация игры
  registerGame(id, config) {
    this.games[id] = config;
  }

  // Запуск игры по ID
  launchGame(gameId) {
    const game = this.games[gameId];
    if (!game) {
      console.error(`Игра "${gameId}" не найдена!`);
      return;
    }

    console.log(`Запускаем игру: ${game.title}`);

    // Очищаем экран (если нужно)
    document.body.innerHTML = `<h1>${game.title}</h1><div id="game-container"></div>`;


    // Подключаем основной скрипт игры
    const script = document.createElement('script');
    script.src = game.entryPoint;
    document.body.appendChild(script);

  }

  // Загрузка дополнительных ресурсов (CSS, изображения и т.д.)
  loadAssets(assets) {
    assets.forEach(url => {
      if (url.endsWith('.css')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      } else {
        // Для изображений/других ресурсов просто загружаем
        const img = new Image();
        img.src = url;
      }
    });
  }
}

// Экспорт экземпляра менеджера
const gameManager = new GameManager();
export default gameManager;
