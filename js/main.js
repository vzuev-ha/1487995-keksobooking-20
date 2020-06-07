'use strict';

var PINS_COUNT = 8;

var APARTMENT_TYPES = ['palace', 'flat', 'house', 'bungalow'];

var X_MIN = 50;
var X_MAX = 1100;
var Y_MIN = 130;
var Y_MAX = 630;

// Для красоты все цены путь будут кратны 100. Соответственно, берем случайное количество "сотен".
var PRICE_MIN_100 = 80;
var PRICE_MAX_100 = 600;

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
 * Генерирует случайный объект размещения
 * @param {int} apartmentNumber Порядковый номер генерируемого объекта
 * @return {{offer: {features: [], rooms: int, address: string, checkin: (string), price: number, guests: int, description: string, title: string, type: (string), checkout: int, photos: []}, author: {avatar: string}, location: {x: int, y: int}}}
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

  return {
    author: {
      // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} это число от 1 до 8 с ведущим нулём.
      // Например, 01, 02 и т. д. Адреса изображений не повторяются
      avatar: 'img/avatars/user0' + apartmentNumber + '.png'
    },
    offer: {
      // строка, заголовок предложения
      title: 'заголовок предложения',

      // строка, адрес предложения. Для простоты пусть пока представляет собой запись вида
      // "{{location.x}}, {{location.y}}", например, "600, 350"
      address: locationX + ', ' + locationY,

      // число, стоимость
      price: getRandomIntInclusive(PRICE_MIN_100, PRICE_MAX_100) * 100,

      // строка с одним из четырёх фиксированных значений: palace, flat, house или bungalow
      type: APARTMENT_TYPES[getRandomIntInclusive(0, APARTMENT_TYPES.length - 1)],

      // число, количество комнат
      rooms: getRandomIntInclusive(ROOMS_MIN, ROOMS_MAX),

      // число, количество гостей, которое можно разместить
      guests: getRandomIntInclusive(GUESTS_MIN, GUESTS_MAX),

      // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
      checkin: CHECK_INOUT_TIMES[checkInIndex],

      // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
      // checkout не может быть больше checkin, поэтому ограничиваем рандом!!!    <<<<<--- самовольное условие ;)
      checkout: getRandomIntInclusive(0, checkInIndex),

      // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
      features: featuresArray,

      // строка с описанием,
      description: 'строка с описанием',

      // массив строк случайной длины, содержащий адреса фотографий
      // "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
      // "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
      // "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
      photos: photosArray
    },
    location: {
      // случайное число, координата x метки на карте.
      // Значение ограничено размерами блока, в котором перетаскивается метка.
      x: locationX,

      // случайное число, координата y метки на карте от 130 до 630
      y: locationY
    }
  };
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
 * Очень главная функция
 */
function generateMockPins() {
  document.querySelector('.map').classList.remove('map--faded');

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

// Покажем на карте случайные метки
generateMockPins();
