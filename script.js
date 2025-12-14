
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const btn = document.querySelector('.contact-card__btn');

    form.addEventListener('submit', function(e) {
      e.preventDefault(); // останавливает перезагрузку

      // Красивая анимация кнопки
      btn.textContent = 'Отправлено!';
      btn.style.background = 'linear-gradient(180deg, #66BB6A, #4CAF50)';

      setTimeout(() => {
        alert('Спасибо! Ваш отзыв отправлен. Мы очень ценим ваше мнение о природе Приднестровья!');
        form.reset(); // очищаем все поля
        btn.textContent = 'Отправить';
        btn.style.background = 'linear-gradient(180deg, #4B99B2, #6ADB90)';
      }, 800);
    });
  });
