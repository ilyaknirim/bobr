export class DeviceUtils {
  static init() {
    this.detectDevice();
    this.setupViewport();
    this.preventZoom();
  }

  static detectDevice() {
    const ua = navigator.userAgent;
    
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    this.isIOS = /iPhone|iPad|iPod/i.test(ua);
    this.isAndroid = /Android/i.test(ua);
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    console.log(`Устройство: ${this.isMobile ? 'Мобильное' : 'Десктоп'}, ${this.isTouch ? 'Сенсорное' : 'Не сенсорное'}`);
  }

  static setupViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (this.isMobile) {
      // Для мобильных устройств настраиваем viewport
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }
  }

  static preventZoom() {
    // Предотвращаем зум жестами
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
      if (e.scale !== 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  static getDPR() {
    return window.devicePixelRatio || 1;
  }

  static isLandscape() {
    return window.innerWidth > window.innerHeight;
  }

  static isPortrait() {
    return window.innerHeight > window.innerWidth;
  }

  static getScreenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: this.getDPR()
    };
  }

  static addResizeListener(callback) {
    let resizeTimeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        callback(this.getScreenSize());
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }
}