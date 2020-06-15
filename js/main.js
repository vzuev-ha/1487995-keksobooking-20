'use strict';

var PINS_COUNT = 8;

var APARTMENT_TYPES = ['bungalo', 'flat', 'house', 'palace'];
var APARTMENT_TYPE_MIN_PRICES = [0, 1000, 5000, 10000];

var X_MIN = 0; // 50;
var X_MAX = document.querySelector('.map').clientWidth; // 1100;
var Y_MIN = 130;
var Y_MAX = 630;

var PRICE_MIN = 8000;
var PRICE_MAX = 60000;

var ROOMS_MIN = 1;
var ROOMS_MAX = 5;

var GUESTS_MIN = 0;
var GUESTS_MAX = 6;

var CHECK_INOUT_TIMES = ['12:00', '13:00', '14:00'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var ROOMS_KEY = [1, 2, 3, 100];

var ROOMS_VALUE = [
  {guests: [1], message: 'В 1 комнате можно разместить только 1 гостя!'},
  {guests: [1, 2], message: 'В 2 комнатах можно разместить только 1 или 2 гостей!'},
  {guests: [1, 2, 3], message: 'В 3 комнатах можно разместить от 1 до 3 гостей!'},
  {guests: [0], message: 'Выбранный вариант размещения - не для гостей!'}
];

/**
 * Получение случайного целого числа в заданном интервале, включительно
 * @param {int} min
 * @param {int} max
 * @return {int} Случайное число
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
}

/**
 * Создает пустой Объект размещения
 * @return {{offer: {features: [], rooms: number, address: string, checkin: string, price: number, guests: number, description: string, title: string, type: string, checkout: string, photos: []}, author: {avatar: string}, location: {x: number, y: number}}}
 */
function generateEmptyApartmentObject() {
  return {
    author: {
      // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} это число от 1 до 8 с ведущим нулём.
      // Например, 01, 02 и т. д. Адреса изображений не повторяются
      avatar: ''
    },
    offer: {
      // строка, заголовок предложения
      title: '',

      // строка, адрес предложения. Для простоты пусть пока представляет собой запись вида
      // "{{location.x}}, {{location.y}}", например, "600, 350"
      address: '',

      // число, стоимость
      price: 0,

      // строка с одним из четырёх фиксированных значений: palace, flat, house или bungalow
      type: '',

      // число, количество комнат
      rooms: 0,

      // число, количество гостей, которое можно разместить
      guests: 0,

      // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
      checkin: '',

      // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
      // checkout не может быть больше checkin, поэтому ограничиваем рандом!!!    <<<<<--- самовольное условие ;)
      checkout: '',

      // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
      features: [],

      // строка с описанием,
      description: '',

      // массив строк случайной длины, содержащий адреса фотографий
      // "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
      // "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
      // "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
      photos: []
    },
    location: {
      // случайное число, координата x метки на карте.
      // Значение ограничено размерами блока, в котором перетаскивается метка.
      x: 0,

      // случайное число, координата y метки на карте от 130 до 630
      y: 0
    }
  };
}

/**
 * Генерирует случайный Объект размещения
 * @param {int} apartmentNumber Порядковый номер генерируемого объекта
 * @return {{offer: {features: *[], rooms: number, address: string, checkin: string, price: number, guests: number, description: string, title: string, type: string, checkout: string, photos: *[]}, author: {avatar: string}, location: {x: number, y: number}}}
 */
function generateMockApartment(apartmentNumber) {
  var locationX = getRandomIntInclusive(X_MIN, X_MAX);
  var locationY = getRandomIntInclusive(Y_MIN, Y_MAX);
  var checkInIndex = getRandomIntInclusive(0, CHECK_INOUT_TIMES.length - 1);

  // Заполняем массив случайными удобствами. Неповторяющимися.
  var featuresArray = [];
  var featuresCount = getRandomIntInclusive(1, 6);
  var currentFeature;

  while (featuresArray.length < featuresCount) {
    currentFeature = FEATURES[getRandomIntInclusive(0, FEATURES.length - 1)];

    if (featuresArray.indexOf(currentFeature) === -1) {
      featuresArray[featuresArray.length] = currentFeature;
    }
  }

  // Заполняем массив фотографиями. Тут попроще алгоритм
  var photosArray = [];
  var photosCount = getRandomIntInclusive(1, PHOTOS.length);
  for (var i = 0; i < photosCount - 1; i++) {
    photosArray[i] = PHOTOS[i];
  }

  // Создаем пустой Объект размещения и наполняем его данными
  var apartment = generateEmptyApartmentObject();

  apartment.author.avatar = 'img/avatars/user0' + apartmentNumber + '.png';

  apartment.offer.title = 'заголовок предложения';
  apartment.offer.address = locationX + ', ' + locationY;
  apartment.offer.price = Math.floor(getRandomIntInclusive(PRICE_MIN, PRICE_MAX) / 100) * 100; // <<< ---- чтобы цены были красивые
  apartment.offer.type = APARTMENT_TYPES[getRandomIntInclusive(0, APARTMENT_TYPES.length - 1)];
  apartment.offer.rooms = getRandomIntInclusive(ROOMS_MIN, ROOMS_MAX);
  apartment.offer.guests = getRandomIntInclusive(GUESTS_MIN, GUESTS_MAX);
  apartment.offer.checkin = CHECK_INOUT_TIMES[checkInIndex];
  apartment.offer.checkout = CHECK_INOUT_TIMES[getRandomIntInclusive(0, checkInIndex)];
  apartment.offer.features = featuresArray;
  apartment.offer.description = 'строка с описанием';
  apartment.offer.photos = photosArray;

  apartment.location.x = locationX;
  apartment.location.y = locationY;

  return apartment;
}

/**
 * Создание HTML-ноды "Метка" из объекта размещения на основе шаблона
 * @param {Object} apartmentObject Объект размещения
 * @param {ActiveX.IXMLDOMNode | Node} pinTemplate Шаблон
 * @return {ActiveX.IXMLDOMNode | Node}
 */
function generateMockPinFromTemplate(apartmentObject, pinTemplate) {
  var pin = pinTemplate.cloneNode(true);

  var pinLeft = apartmentObject.location.x - Math.round(pin.style.width / 2);
  var pinTop = apartmentObject.location.y - pin.style.height;

  pin.style = 'left: ' + pinLeft + 'px; top: ' + pinTop + 'px;';
  pin.children[0].src = apartmentObject.author.avatar;
  pin.children[0].alt = apartmentObject.offer.title;

  return pin;
}

/**
 * Генерация тестовых меток на карте
 */
function generateMockPins() {
  // Найдем заранее заготовленный HTML-шаблон
  var template = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  // Создадим и заполним фрагмент
  var fragment = document.createDocumentFragment();
  var pinsArray = [];

  for (var i = 0; i < PINS_COUNT; i++) {
    pinsArray[i] = generateMockPinFromTemplate(generateMockApartment(i + 1), template);
    fragment.appendChild(pinsArray[i]);
  }

  // Найдем блок для размещения меток
  var pinsPlaceholder = document.querySelector('.map__pins');

  // Создаем DocumentFragment, наполненный метками, и добавляем его в разметку
  pinsPlaceholder.appendChild(fragment);
}

/**
 * Переключение состояния страницы (блокировка/разблокировка)
 * @param {boolean} isActivate Активировать?
 */
function switchActiveState(isActivate) {
  var mapControl = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = mapFiltersContainer.querySelectorAll('select, fieldset');

  var adForm = document.querySelector('.ad-form');
  var adFormFieldSets = adForm.querySelectorAll('fieldset');

  // Установим соответствующее состояние полям ввода
  var i;
  for (i = 0; i < mapFilters.length - 1; i++) {
    mapFilters[i].disabled = !isActivate;
  }

  for (i = 0; i < adFormFieldSets.length - 1; i++) {
    adFormFieldSets[i].disabled = !isActivate;
  }

  if (isActivate) {
    // Включим карту
    mapControl.classList.remove('map--faded');

    // Включим элементы управления
    adForm.classList.remove('ad-form--disabled');

  } else {
    // Отключим карту
    mapControl.classList.add('map--faded');

    // Отключим элементы управления
    adForm.classList.add('ad-form--disabled');
  }
}

/**
 * Заполнение поля адреса координатами метки
 */
function fillAddressFromPinMain() {
  var adForm = document.querySelector('.ad-form');
  var addressField = adForm.querySelector('#address');
  var mapPinMain = document.querySelector('.map__pin--main');

  var x = parseInt(mapPinMain.style.left + Math.round(mapPinMain.style.width / 2), 10);
  var y = parseInt(mapPinMain.style.top + mapPinMain.style.height, 10);

  addressField.value = x + ', ' + y;
}

/**
 * Активация страницы
 */
function activatePage() {
  switchActiveState(true);

  // Покажем на карте случайные метки
  generateMockPins();
}

/**
 * Деактивация страницы
 */
function deactivatePage() {
  switchActiveState(false);
}

/**
 * Обработчик клика по главной метке
 * @param {event} evt
 */
function onMapPinMainClick(evt) {
  if (typeof evt === 'object' && evt.button === 0) {
    // Активировать страницу
    activatePage();

    // Заполнить поле адреса
    fillAddressFromPinMain();
  }
}

/**
 * Обработчик изменения формы создания объявления. Единый для всех полей.
 * @param {event} evt
 */
function onAdFormChange(evt) {
  // Делаем все проверки в одном обработчике, так легче управлять кодом
  var adForm = document.querySelector('.ad-form');

  if (evt.target) {
    if (evt.target.id === 'timein') {
      adForm.querySelector('#timeout').value = evt.target.value;

    } else if (evt.target.id === 'timeout') {
      adForm.querySelector('#timein').value = evt.target.value;

    } else if (evt.target.id === 'type') {
      adForm.querySelector('#price').min = APARTMENT_TYPE_MIN_PRICES[APARTMENT_TYPES.indexOf(evt.target.value)];

    } else if (evt.target.id === 'room_number') {
      changeCapacityValidity(evt.target, adForm.querySelector('#capacity'));

    } else if (evt.target.id === 'capacity') {
      changeCapacityValidity(adForm.querySelector('#room_number'), evt.target);

    }
  }
}

/**
 * Установка CustomValidity для поля Capacity (вместимость)
 * @param {HTMLElement} roomInput Поле ввода количества комнат
 * @param {HTMLElement} guestInput Поле ввода количества гостей
 */
function changeCapacityValidity(roomInput, guestInput) {
  var roomNum = parseInt(roomInput.value, 10);
  var guestNum = parseInt(guestInput.value, 10);

  // Найдем массив возможных значений Кол-ва гостей для данного Кол-ва комнат
  // Делаем это при помощи двух массивов - один с ключами, другой - со значениями
  // Поскольку find по массиву объектов нам пока нельзя ;)
  var roomValue = ROOMS_VALUE[ROOMS_KEY.indexOf(roomNum)];
  if (roomValue) {
    // Если такое количество гостей во-можно - стираем ошибку, иначе - обновляем из массива
    if (roomValue.guests.indexOf(guestNum) > -1) {
      guestInput.setCustomValidity('');
    } else {
      guestInput.setCustomValidity(roomValue.message);
    }
  } else {
    guestInput.setCustomValidity('');
  }
}

/**
 * Главная функция
 */
function init() {
  // Деактивируем страницу
  deactivatePage();

  // Навесим событие на главный Pin
  var mapPinMain = document.querySelector('.map__pin--main');
  mapPinMain.addEventListener('click', onMapPinMainClick);

  // И заполним адрес значениями этого Pin-а
  fillAddressFromPinMain();

  // Навесим события на input-ы формы создания объявления
  var adForm = document.querySelector('.ad-form');

  adForm.querySelector('#timein').addEventListener('change', onAdFormChange);
  adForm.querySelector('#timeout').addEventListener('change', onAdFormChange);

  adForm.querySelector('#type').addEventListener('change', onAdFormChange);

  adForm.querySelector('#room_number').addEventListener('change', onAdFormChange);
  adForm.querySelector('#capacity').addEventListener('change', onAdFormChange);
  // Обновим состояние, чтобы валидность проверялась даже без изменения инпутов
  changeCapacityValidity(
      adForm.querySelector('#room_number'),
      adForm.querySelector('#capacity')
  );
}

init();
