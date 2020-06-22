'use strict';

(function () {
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
    var locationX = window.kbUtils.getRandomIntInclusive(window.kbConstants.X_MIN, window.kbConstants.X_MAX);
    var locationY = window.kbUtils.getRandomIntInclusive(window.kbConstants.Y_MIN, window.kbConstants.Y_MAX);
    var checkInIndex = window.kbUtils.getRandomIntInclusive(0, window.kbConstants.CHECK_INOUT_TIMES.length - 1);

    // Заполняем массив случайными удобствами. Неповторяющимися.
    var featuresArray = [];
    var featuresCount = window.kbUtils.getRandomIntInclusive(1, 6);
    var currentFeature;

    while (featuresArray.length < featuresCount) {
      currentFeature = window.kbConstants.FEATURES[window.kbUtils.getRandomIntInclusive(0,
          window.kbConstants.FEATURES.length - 1)];

      if (featuresArray.indexOf(currentFeature) === -1) {
        featuresArray[featuresArray.length] = currentFeature;
      }
    }

    // Заполняем массив фотографиями. Тут попроще алгоритм
    var photosArray = [];
    var photosCount = window.kbUtils.getRandomIntInclusive(1, window.kbConstants.MOCK_PHOTOS.length);
    for (var i = 0; i < photosCount - 1; i++) {
      photosArray[i] = window.kbConstants.MOCK_PHOTOS[i];
    }

    // Создаем пустой Объект размещения и наполняем его данными
    var apartment = generateEmptyApartmentObject();

    apartment.author.avatar = 'img/avatars/user0' + apartmentNumber + '.png';

    apartment.offer.title = 'заголовок предложения';
    apartment.offer.address = locationX + ', ' + locationY;
    apartment.offer.price = Math.floor(window.kbUtils.getRandomIntInclusive(window.kbConstants.PRICE_MIN,
        window.kbConstants.PRICE_MAX) / 100) * 100; // <<< ---- чтобы цены были красивые
    apartment.offer.type = window.kbConstants.APARTMENT_TYPES[window.kbUtils.getRandomIntInclusive(0,
        window.kbConstants.APARTMENT_TYPES.length - 1)];
    apartment.offer.rooms = window.kbUtils.getRandomIntInclusive(window.kbConstants.ROOMS_MIN,
        window.kbConstants.ROOMS_MAX);
    apartment.offer.guests = window.kbUtils.getRandomIntInclusive(window.kbConstants.GUESTS_MIN,
        window.kbConstants.GUESTS_MAX);
    apartment.offer.checkin = window.kbConstants.CHECK_INOUT_TIMES[checkInIndex];
    apartment.offer.checkout = window.kbConstants.CHECK_INOUT_TIMES[window.kbUtils.getRandomIntInclusive(0,
        checkInIndex)];
    apartment.offer.features = featuresArray;
    apartment.offer.description = 'строка с описанием';
    apartment.offer.photos = photosArray;

    apartment.location.x = locationX;
    apartment.location.y = locationY;

    return apartment;
  }

  window.kbMockData = {
    generateApartment: generateMockApartment
  };

})();
