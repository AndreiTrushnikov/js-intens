const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

// day one

let login = localStorage.getItem('deliveryLogin') ;

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonInModalLogin = document.querySelector('.button-login');

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

    function checkModalInput(){
      if (logInInput.value == '') {
        logInInput.style.borderColor = "red";
        buttonInModalLogin.setAttribute("disable")
      } else {
        logInInput.style.borderColor = "";
        buttonInModalLogin.removeAttribute("disable")
      }
    }
    logInInput.oninput = checkModalInput()

    login = logInInput.value;
    localStorage.setItem('deliveryLogin', login);
    toggleModalAuth();
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();
    checkAuth();
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
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

// первый вызов
checkAuth();