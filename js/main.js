'use strict';

let login = localStorage.getItem('deliveryLogin');

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

// submenu
const subMenuName = document.querySelector('.restaurant-title');
const subMenuStars = document.querySelector('.rating');
const subMenuPrice = document.querySelector('.price');
const subMenuNameCategory = document.querySelector('.category')

// basket
const cart = JSON.parse(localStorage.getItem('CART'));
const modalBody = document.querySelector('.modal-body');
const modalPriceTag = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');
console.log(cart);

const saveCart = function () {
    localStorage.setItem('CART', JSON.stringify(cart))
}

// Ajax Await
const getData = async function (url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, status = ${response.status}!`);
    }
    return await response.json();
}

// ф. показать/скрыть модалку
function toggleModal() {
    modal.classList.toggle("is-open");
};

// ф. показать/скрыть модалку авторизации
function toggleModalAuth() {
    logInInput.style.borderColor = "";
    modalAuth.classList.toggle("is-open");
};

// ф. для авторизованного пользователя
function authorized() {
    // сама функция разлогина
    function logOut() {
        login = null;
        localStorage.removeItem('deliveryLogin')
        buttonAuth.style.display = "";
        userName.style.display = "";
        buttonOut.style.display = "";
        cartButton.style.display = ""
        buttonOut.removeEventListener('click', toggleModalAuth);
        checkAuth();
        returnMain();
    };

    // отрисовываем на странице имя пользователя
    userName.textContent = login;

    // скрываем кнопку Войти, показываем кнопку Выйти и Имя пользователя
    buttonAuth.style.display = "none";
    userName.style.display = "inline";
    buttonOut.style.display = "flex";
    cartButton.style.display = "flex";
    buttonOut.addEventListener('click', logOut);
};

// функция для не авторизованного пользователя
function notAuthorized() {
    // ф. логина
    function logIn(e) {
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
        } else {
            logInInput.style.borderColor = "red"
        }
    };

    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    // modalAuth.addEventListener("click", toggleModalAuth);
    logInForm.addEventListener('submit', logIn);
};

// ф. проверки логина
function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
};

// Функция создания карточки ресторана
function createCardRestaurant(restaurant) {
    const {
        image,
        kitchen,
        name,
        price,
        products,
        stars,
        time_of_delivery: timeOfDelivery
    } = restaurant;

    const card = `
  <a class="card card-restaurant" data-products="${products}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
  `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card)
};

// ф. создания карточки товара
function createCardGood(goods) {
    console.log(goods);

    const {
        description,
        id,
        image,
        name,
        price
    } = goods;
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart" id="${id}">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);
    cardsMenu.insertAdjacentElement('beforeend', card);
};

// ф. обновления подменю
// function updateSubMenu() {
//  subMenuName
//  subMenuStars
// subMenuPrice
// subMenuNameCategory
// }
// ф. сброса страницы к первоначальному виду 
function returnMain() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
}
// ф. сокрытия карточек ресторана и показа карточек товаров определенного ресторана
function openGoods(e) {
    if (login) {
        const target = e.target;
        const restaurant = target.closest('.card-restaurant');
        if (restaurant) {
            console.log(restaurant.dataset.products);

            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardGood)
            });
        }
    } else {
        toggleModalAuth()
    }
};

// ф. добавления в корзину
function addToCart(e) {
    const target = e.target;
    const buttonAddToCart = target.closest('.button-add-cart');
    if (buttonAddToCart) {
        const card = target.closest('.card');
        const title = card.querySelector('.card-title').textContent;
        const price = card.querySelector('.card-price').textContent;
        const id = buttonAddToCart.id;

        // проверка на повторное добавление товара
        const food = cart.find(function (item) {
            return item.id === id
        })

        if (food) {
            food.count += 1;
        } else {
            cart.push({
                id,
                title,
                price,
                count: 1
            })
        }
        saveCart();
    }
}

// ф. отрисовки корзины
function renderCart() {
    modalBody.textContent = '';

    cart.forEach(function (item) {
        const {
            id,
            title,
            price,
            count
        } = item;
        const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${price}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;
        modalBody.insertAdjacentHTML('afterbegin', itemCart)
    });

    // нахождение суммы всех товаров
    const totalPrice = cart.reduce(function (result, item) {
        return result + (parseFloat(item.price) * item.count);
    }, 0);

    modalPriceTag.textContent = totalPrice + ' ₽';
}

// ф. изменения количества товаров при нажатии на кнопки +/-
function changeCount(e) {
    const target = e.target;

    if (target.classList.contains('counter-button')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        if (target.classList.contains('counter-minus')) {
            food.count--;
            if (food.count == 0) {
                cart.splice(cart.indexOf('food'), 1);
            }
        }
        if (target.classList.contains('counter-plus')) food.count++;
        renderCart();
    }
}

// ф. инициализации всего сайта
function init() {
    // первый вызов ф. проверки авторизации
    checkAuth();

    getData('./db/partners.json').then(function (data) {
        data.forEach(createCardRestaurant)
    });
    // 
    buttonClearCart.addEventListener('click', function () {
        cart.length = 0;
        renderCart();
    })
    // Навешиваем функции +/- товаров в корзине
    modalBody.addEventListener('click', changeCount);
    // Добавляем товар в корзину
    cardsMenu.addEventListener('click', addToCart);
    // Показать модальное окно
    cartButton.addEventListener("click", function () {
        renderCart();
        toggleModal();
    });
    // Закрыть модальное окно
    close.addEventListener("click", toggleModal);
    // Вызов OpenGoods при клике на карточки ресторанов
    cardsRestaurants.addEventListener('click', openGoods);
    // Возврат к начальной странице по клику на лого
    logo.addEventListener('click', returnMain());
}

init();