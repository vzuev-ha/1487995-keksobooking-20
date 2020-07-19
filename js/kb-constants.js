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

  var ROOMS_KEY = [1, 2, 3, 100];

  var ROOMS_VALUE = [
    {guests: [1], message: 'В 1 комнате можно разместить только 1 гостя!'},
    {guests: [1, 2], message: 'В 2 комнатах можно разместить только 1 или 2 гостей!'},
    {guests: [1, 2, 3], message: 'В 3 комнатах можно разместить от 1 до 3 гостей!'},
    {guests: [0], message: 'Выбранный вариант размещения - не для гостей!'}
  ];


  window.kbConstants = {
    PINS_COUNT: MAX_PINS_COUNT,

    MAP_PIN_MAIN_TAIL_OFFSET: MAP_PIN_MAIN_TAIL_OFFSET,

    APARTMENT_TYPES: APARTMENT_TYPES,
    APARTMENT_TYPES_RUS: APARTMENT_TYPES_RUS,

    APARTMENT_TYPE_MIN_PRICES: APARTMENT_TYPE_MIN_PRICES,

    X_MIN: X_MIN,
    X_MAX: X_MAX,
    Y_MIN: Y_MIN,
    Y_MAX: Y_MAX,

    PRICE_MIN: PRICE_MIN,
    PRICE_MAX: PRICE_MAX,

    ROOMS_MIN: ROOMS_MIN,
    ROOMS_MAX: ROOMS_MAX,

    GUESTS_MIN: GUESTS_MIN,
    GUESTS_MAX: GUESTS_MAX,

    CHECK_INOUT_TIMES: CHECK_INOUT_TIMES,

    FEATURES: FEATURES,

    ROOMS_KEY: ROOMS_KEY,

    ROOMS_VALUE: ROOMS_VALUE
  };

})();
