export class AssetLoader {
  static async loadAll() {
    const assets = {
      images: {},
      sounds: {},
      fonts: {}
    };

    try {
      // Загрузка изображений (если будут добавлены)
      // assets.images.sprite = await this.loadImage('assets/sprite.png');
      
      // Загрузка шрифтов
      await this.loadFonts();
      
      // Симуляция загрузки (можно заменить на реальную)
      await this.delay(1000);
      
      return assets;
    } catch (error) {
      console.error('Ошибка загрузки ресурсов:', error);
      throw error;
    }
  }

  static loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  static async loadFonts() {
    // Предзагрузка шрифтов Google Fonts
    if ('fonts' in document) {
      try {
        await document.fonts.load('bold 20px "PT Sans"');
        await document.fonts.load('16px "PT Sans"');
        console.log('Шрифты загружены');
      } catch (error) {
        console.warn('Не удалось загрузить шрифты:', error);
      }
    }
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static createImageFromSVG(svgString) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    });
  }

  static getBeaverSVG() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="40">
        <!-- Тело бобра, вытянутое вправо -->
        <ellipse cx="25" cy="24" rx="18" ry="12" fill="#8b5a2b"/>
        <!-- Голова -->
        <ellipse cx="35" cy="16" rx="12" ry="9" fill="#a66a3c"/>
        <!-- Глаза -->
        <circle cx="32" cy="14" r="2" fill="#000"/>
        <circle cx="38" cy="14" r="2" fill="#000"/>
        <!-- Нос -->
        <circle cx="42" cy="16" r="1.5" fill="#000"/>
        <!-- Зубы -->
        <rect x="40" y="18" width="2" height="3" fill="#fff"/>
        <rect x="43" y="18" width="2" height="3" fill="#fff"/>
        <!-- Хвост -->
        <ellipse cx="8" cy="26" rx="8" ry="6" fill="#7a4a23"/>
        <!-- Ноги для бега -->
        <rect x="15" y="30" width="4" height="8" rx="2" fill="#6b4a1b"/>
        <rect x="25" y="30" width="4" height="8" rx="2" fill="#6b4a1b"/>
        <!-- Уши -->
        <ellipse cx="30" cy="8" rx="3" ry="4" fill="#a66a3c"/>
        <ellipse cx="38" cy="8" rx="3" ry="4" fill="#a66a3c"/>
      </svg>`;
  }

  static getBottleSVG() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="40">
        <rect x="8" y="6" width="8" height="28" rx="3" fill="#3aaed8"/>
        <rect x="10" y="0" width="4" height="6" fill="#2b8fb3"/>
      </svg>`;
  }

  static getProgress() {
    // Возвращает прогресс загрузки (0-1)
    // В реальном приложении можно отслеживать загрузку каждого ресурса
    return 1;
  }
}