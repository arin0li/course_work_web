// Система управления избранным
class FavoritesManager {
  constructor() {
    this.storageKey = 'ecotravel_favorites';
    this.favorites = this.loadFavorites();
  }

  loadFavorites() {
    const stored = localStorage.getItem(this.storageKey);
    const favorites = stored ? JSON.parse(stored) : { routes: [], attractions: [] };
    // Удаляем дубликаты при загрузке
    this.removeDuplicates(favorites);
    return favorites;
  }

  removeDuplicates(favorites) {
    // Удаляем дубликаты маршрутов по id
    const seenRoutes = new Set();
    favorites.routes = favorites.routes.filter(route => {
      if (seenRoutes.has(route.id)) {
        return false;
      }
      seenRoutes.add(route.id);
      return true;
    });

    // Удаляем дубликаты достопримечательностей по id
    const seenAttractions = new Set();
    favorites.attractions = favorites.attractions.filter(attraction => {
      if (seenAttractions.has(attraction.id)) {
        return false;
      }
      seenAttractions.add(attraction.id);
      return true;
    });
  }

  saveFavorites() {
    // Удаляем дубликаты перед сохранением
    this.removeDuplicates(this.favorites);
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    this.updateFavoritesCount();
  }

  addRoute(routeId, routeData) {
    // Удаляем дубликаты перед проверкой
    this.removeDuplicates(this.favorites);
    
    // Проверяем, нет ли уже такого маршрута
    const existingIndex = this.favorites.routes.findIndex(r => r.id === routeId);
    if (existingIndex === -1) {
      this.favorites.routes.push({ id: routeId, ...routeData });
      this.saveFavorites();
      return true;
    }
    // Если уже есть, обновляем данные (на случай, если изменились)
    this.favorites.routes[existingIndex] = { id: routeId, ...routeData };
    this.saveFavorites();
    return false; // Не добавляли новый, значит false
  }

  removeRoute(routeId) {
    this.favorites.routes = this.favorites.routes.filter(r => r.id !== routeId);
    this.saveFavorites();
    return true;
  }

  addAttraction(attractionId, attractionData) {
    // Удаляем дубликаты перед проверкой
    this.removeDuplicates(this.favorites);
    
    // Проверяем, нет ли уже такой достопримечательности
    const existingIndex = this.favorites.attractions.findIndex(a => a.id === attractionId);
    if (existingIndex === -1) {
      this.favorites.attractions.push({ id: attractionId, ...attractionData });
      this.saveFavorites();
      return true;
    }
    // Если уже есть, обновляем данные (на случай, если изменились)
    this.favorites.attractions[existingIndex] = { id: attractionId, ...attractionData };
    this.saveFavorites();
    return false; // Не добавляли новый, значит false
  }

  removeAttraction(attractionId) {
    this.favorites.attractions = this.favorites.attractions.filter(a => a.id !== attractionId);
    this.saveFavorites();
    return true;
  }

  isRouteFavorite(routeId) {
    return this.favorites.routes.some(r => r.id === routeId);
  }

  isAttractionFavorite(attractionId) {
    return this.favorites.attractions.some(a => a.id === attractionId);
  }

  getAllFavorites() {
    // Удаляем дубликаты перед возвратом
    this.removeDuplicates(this.favorites);
    // Сохраняем очищенные данные (без обновления счетчика, чтобы не было лишних обновлений)
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    return this.favorites;
  }

  updateFavoritesCount() {
    const count = this.favorites.routes.length + this.favorites.attractions.length;
    const countElement = document.querySelector('.favorites-count');
    if (countElement) {
      countElement.textContent = count;
      countElement.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  toggleRoute(routeId, routeData) {
    if (this.isRouteFavorite(routeId)) {
      this.removeRoute(routeId);
      return false;
    } else {
      this.addRoute(routeId, routeData);
      return true;
    }
  }

  toggleAttraction(attractionId, attractionData) {
    if (this.isAttractionFavorite(attractionId)) {
      this.removeAttraction(attractionId);
      return false;
    } else {
      this.addAttraction(attractionId, attractionData);
      return true;
    }
  }
}

// Глобальный экземпляр
const favoritesManager = new FavoritesManager();

// Инициализация кнопок избранного
document.addEventListener('DOMContentLoaded', function() {
  // Обновляем счетчик при загрузке (с небольшой задержкой для гарантии)
  setTimeout(() => {
    favoritesManager.updateFavoritesCount();
  }, 100);

  // Кнопка "Наверх" (общая для всех страниц, где подключен favorites.js)
  (function initBackToTop() {
    const btn = document.createElement('button');
    btn.textContent = '↑';
    btn.setAttribute('aria-label', 'Наверх');
    btn.className = 'back-to-top-btn';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '20px',
      bottom: '24px',
      width: '44px',
      height: '44px',
      background: '#6adb90',
      color: '#0f2f1f',
      border: 'none',
      borderRadius: '50%',
      boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: '700',
      fontFamily: 'Rubik, sans-serif',
      zIndex: '999',
      display: 'none',
      transition: 'opacity 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease'
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 10px 24px rgba(0,0,0,0.28)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.18)';
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(btn);

    const toggleVisibility = () => {
      const shouldShow = window.scrollY > 400;
      btn.style.display = shouldShow ? 'block' : 'none';
      btn.style.opacity = shouldShow ? '1' : '0';
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility);
  })();

  // Инициализируем кнопки избранного для маршрутов
  document.querySelectorAll('.favorite-btn-route').forEach(btn => {
    const routeId = btn.dataset.routeId;
    if (routeId && favoritesManager.isRouteFavorite(routeId)) {
      btn.classList.add('active');
      btn.querySelector('i').classList.remove('far');
      btn.querySelector('i').classList.add('fas');
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const routeData = {
        title: btn.dataset.routeTitle || '',
        description: btn.dataset.routeDesc || '',
        image: btn.dataset.routeImage || ''
      };
      const isFavorite = favoritesManager.toggleRoute(routeId, routeData);
      if (isFavorite) {
        btn.classList.add('active');
        btn.querySelector('i').classList.remove('far');
        btn.querySelector('i').classList.add('fas');
      } else {
        btn.classList.remove('active');
        btn.querySelector('i').classList.remove('fas');
        btn.querySelector('i').classList.add('far');
      }
      favoritesManager.updateFavoritesCount();
    });
  });

  // Инициализируем кнопки избранного для достопримечательностей
  document.querySelectorAll('.favorite-btn-attraction').forEach(btn => {
    const attractionId = btn.dataset.attractionId;
    if (attractionId && favoritesManager.isAttractionFavorite(attractionId)) {
      btn.classList.add('active');
      btn.querySelector('i').classList.remove('far');
      btn.querySelector('i').classList.add('fas');
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const attractionData = {
        title: btn.dataset.attractionTitle || '',
        description: btn.dataset.attractionDesc || '',
        image: btn.dataset.attractionImage || ''
      };
      const isFavorite = favoritesManager.toggleAttraction(attractionId, attractionData);
      if (isFavorite) {
        btn.classList.add('active');
        btn.querySelector('i').classList.remove('far');
        btn.querySelector('i').classList.add('fas');
      } else {
        btn.classList.remove('active');
        btn.querySelector('i').classList.remove('fas');
        btn.querySelector('i').classList.add('far');
      }
      favoritesManager.updateFavoritesCount();
    });
  });
});

