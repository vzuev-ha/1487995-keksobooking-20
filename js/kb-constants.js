'use strict';

(function () {
  var MAX_PINS_COUNT = 5;

  var MAP_PIN_MAIN_TAIL_HEIGHT = 15;

  // Смещение острого конца метки относительно левого верхнего края метки
  var MAP_PIN_MAIN_TAIL_OFFSET = {
    offsetX: Math.round(document.querySelector('.map__pin--main')
      .getBoundingClientRect().width / 2),
    offsetY: Math.round(document.querySelector('.map__pin--main')
      .getBoundingClientRect().height) + MAP_PIN_MAIN_TAIL_HEIGHT
  };

  var APARTMENT_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var APARTMENT_TYPES_RUS = ['Бунгало', 'Квартира', 'Дом', 'Дворец'];

  var APARTMENT_TYPE_MIN_PRICES = [0, 1000, 5000, 10000];

  var PIN_X_MIN = 0; // 50;
  var PIN_X_MAX = document.querySelector('.map').clientWidth; // 1100;
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;

  var PRICE_MIN = 8000;
  var PRICE_MAX = 60000;

  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;

  var GUESTS_MIN = 0;
  var GUESTS_MAX = 6;

  var CHECK_INOUT_TIMES = ['12:00', '13:00', '14:00'];

  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var ROOMS_KEY = [1, 2, 3, 100];

  var ROOMS_VALUE = [
    {guests: [1], message: 'В 1 комнате можно разместить только 1 гостя!'},
    {guests: [1, 2], message: 'В 2 комнатах можно разместить только 1 или 2 гостей!'},
    {guests: [1, 2, 3], message: 'В 3 комнатах можно разместить от 1 до 3 гостей!'},
    {guests: [0], message: 'Выбранный вариант размещения - не для гостей!'}
  ];

  var PLURAL_ENDINGS_ROOM = ['комната', 'комнаты', 'комнат'];
  var PLURAL_ENDINGS_GUEST = ['гостя', 'гостей', 'гостей'];


  // Служебные константы
  var AVATAR_PREVIEW_CLASS = '.ad-form-header__preview img';
  var PHOTO_PREVIEW_CLASS = '.ad-form__photo img';
  var AVATAR_DEFAULT_IMAGE_SRC = document.querySelector(AVATAR_PREVIEW_CLASS).src;

  var USER_DEFAULT_IMAGE_SRC = 'img/avatars/default.png';

  var IMAGE_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var BACKEND_SUBMIT_URL = 'https://javascript.pages.academy/keksobooking';
  var BACKEND_DATA_URL = 'https://javascript.pages.academy/keksobooking/data';
  var BackendStatusCodes = {
    OK: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
  };
  var BACKEND_TIMEOUT_IN_MS = 10000;
    var BackendHTTPMethods = {
    GET: 'GET',
    POST: 'POST'
  };

  var DEBOUNCE_INTERVAL = 500; // ms


  var MAP_PIN_MAIN_LEFT_TOP_COORDS = {
    x: document.querySelector('.map__pin--main').offsetLeft,
    y: document.querySelector('.map__pin--main').offsetTop
  };

  // Захардкодим размеры меток. Не очень хорошо, но в момент их создания мы не можем получить их размеры.
  var PIN_DIMENSIONS = {
    width: 50,
    height: 70
  };


  //
  // Экспорт
  //

  window.kbConstants = {
    MAX_PINS_COUNT: MAX_PINS_COUNT,

    MAP_PIN_MAIN_TAIL_OFFSET: MAP_PIN_MAIN_TAIL_OFFSET,

    APARTMENT_TYPES: APARTMENT_TYPES,
    APARTMENT_TYPES_RUS: APARTMENT_TYPES_RUS,

    APARTMENT_TYPE_MIN_PRICES: APARTMENT_TYPE_MIN_PRICES,

    PIN_X_MIN: PIN_X_MIN,
    PIN_X_MAX: PIN_X_MAX,
    PIN_Y_MIN: PIN_Y_MIN,
    PIN_Y_MAX: PIN_Y_MAX,

    PRICE_MIN: PRICE_MIN,
    PRICE_MAX: PRICE_MAX,

    ROOMS_MIN: ROOMS_MIN,
    ROOMS_MAX: ROOMS_MAX,

    GUESTS_MIN: GUESTS_MIN,
    GUESTS_MAX: GUESTS_MAX,

    CHECK_INOUT_TIMES: CHECK_INOUT_TIMES,

    FEATURES: FEATURES,

    ROOMS_KEY: ROOMS_KEY,

    ROOMS_VALUE: ROOMS_VALUE,

    PLURAL_ENDINGS_ROOM: PLURAL_ENDINGS_ROOM,
    PLURAL_ENDINGS_GUEST: PLURAL_ENDINGS_GUEST,


    // Служебные константы
    AVATAR_PREVIEW_CLASS: AVATAR_PREVIEW_CLASS,
    PHOTO_PREVIEW_CLASS: PHOTO_PREVIEW_CLASS,
    AVATAR_DEFAULT_IMAGE_SRC: AVATAR_DEFAULT_IMAGE_SRC,

    USER_DEFAULT_IMAGE_SRC: USER_DEFAULT_IMAGE_SRC,

    IMAGE_FILE_TYPES: IMAGE_FILE_TYPES,

    BACKEND_SUBMIT_URL: BACKEND_SUBMIT_URL,
    BACKEND_DATA_URL: BACKEND_DATA_URL,
    BackendStatusCodes: BackendStatusCodes,
    BACKEND_TIMEOUT_IN_MS: BACKEND_TIMEOUT_IN_MS,
    BackendHTTPMethods: BackendHTTPMethods,

    DEBOUNCE_INTERVAL: DEBOUNCE_INTERVAL,


    MAP_PIN_MAIN_LEFT_TOP_COORDS: MAP_PIN_MAIN_LEFT_TOP_COORDS,
    PIN_DIMENSIONS: PIN_DIMENSIONS
  };

})();
