'use strict';

let login = localStorage.getItem('deliveryLogin') ;

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonInModalLogin = document.querySelector('.button-login');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

// ф. показать/скрыть модалку 
function toggleModal() {
  modal.classList.toggle("is-open");
}

// ф. показать/скрыть модалку авторизации
function toggleModalAuth() {
  logInInput.style.borderColor = "";
  modalAuth.classList.toggle("is-open");
}

// ф. для авторизованного пользователя
function authorized() {
  // сама функция разлогина
  function logOut() {
    login = null;
    localStorage.removeItem('deliveryLogin')
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener('click', toggleModalAuth);
    checkAuth();
  }

  // отрисовываем на странице имя пользователя
  userName.textContent = login;

  // скрываем кнопку Войти, показываем кнопку Выйти и Имя пользователя
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";
  buttonOut.addEventListener('click', logOut);
}

// функция для не авторизованного пользователя
function notAuthorized() {
  // ф. логина
  function logIn(e){
    e.preventDefault();
      if (logInInput.value.trim()) {
        login = logInInput.value;
        localStorage.setItem('deliveryLogin', login);
        toggleModalAuth();
        buttonAuth.removeEventListener('click', toggleModalAuth);
        closeAuth.removeEventListener('click', toggleModalAuth);
        // modalAuth.removeEventListener("click", toggleModalAuth);
        logInForm.removeEventListener('submit', logIn);
        logInForm.reset();
        checkAuth();
      }  else {
        logInInput.style.borderColor = "red"
      }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  // modalAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

// ф. проверки логина
function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

// Функция создания карточки ресторана
function createCardRestaurant() {
  const card = `
  <a class="card card-restaurant">
    <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Пицца плюс</h3>
        <span class="card-tag tag">50 мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 900 ₽</div>
        <div class="category">Пицца</div>
      </div>
    </div>
  </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card)
}

// ф. создания карточки товара
function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="img/pizza-plus/pizza-oleole.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">Пицца Оле-Оле</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">Соус томатный, сыр «Моцарелла», черри, маслины, зелень, майонез
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">440 ₽</strong>
        </div>
      </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);  
}

// ф. сокрытия карточек ресторана и показа карточек товаров определенного ресторана
function openGoods(e) {
  if (login) {
    const target = e.target;
    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      createCardGood();
    }  
  } else {
    toggleModalAuth()
  }
}

// первый вызов ф. создания карточки ресторана
createCardRestaurant();

// первый вызов ф. проверки авторизации
checkAuth(); 

// Показать модальное окно
cartButton.addEventListener("click", toggleModal);
// Закрыть модальное окно
close.addEventListener("click", toggleModal);
// Вызов OpenGoods при клике на карточки ресторанов
cardsRestaurants.addEventListener('click', openGoods);
// Возврат к начальной странице по клику на лого
logo.addEventListener('click', function(){
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})