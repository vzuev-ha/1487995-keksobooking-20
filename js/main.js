'use strict';

var PINS_COUNT = 8;

var APARTMENT_TYPES = ['palace', 'flat', 'house', 'bungalow'];

var X_MIN = 50;
var X_MAX = 1100;
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
