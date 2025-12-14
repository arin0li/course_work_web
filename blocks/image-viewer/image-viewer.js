// Модальное окно для просмотра больших изображений
document.addEventListener('DOMContentLoaded', function() {
  const imageModal = document.getElementById('modal-image-viewer');
  const imageModalImg = document.getElementById('modal-image-viewer-img');
  const imageModalClose = imageModal.querySelector('.modal__close');
  
  // Обработчики для открытия модального окна при клике на изображения ТОЛЬКО в галереях
  // Обрабатываем только изображения в галереях на страницах отдельных маршрутов/достопримечательностей
  document.querySelectorAll('.gallery-image img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      let imageSrc = '';
      
      if (this.src) {
        imageSrc = this.src;
      } else if (this.getAttribute('src')) {
        imageSrc = this.getAttribute('src');
      }
      
      if (imageSrc) {
        imageModalImg.src = imageSrc;
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Закрытие модального окна
  imageModalClose.addEventListener('click', function() {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
  });
  
  // Закрытие при клике вне изображения
  imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Закрытие при нажатии Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal.style.display === 'block') {
      imageModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
});

