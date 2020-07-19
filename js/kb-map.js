'use strict';

(function () {

  /**
   * Генерация тестовых меток на карте
   * @param {Array} objectsJSON Массив данных, полученных по сети
   */
  function generatePins(objectsJSON) {
    // Создадим и заполним фрагмент
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < Math.min(window.kbConstants.PINS_COUNT, objectsJSON.length); i++) {
      // ТЗ, условие 5.2:  Если в объекте с описанием объявления отсутствует поле offer,
      //   то метка объявления не должна отображаться на карте.
      if (!objectsJSON[i].offer) {
        continue;
      }

      var pin = window.kbPin.generatePinFromTemplate(objectsJSON[i]);
      pin.dataset.index = i.toString();
      pin.addEventListener('click', onPinClick);

      fragment.appendChild(pin);
    }

    // Добавляем наполненный DocumentFragment в разметку
    clearPlaceholder();
    pinsPlaceholder.appendChild(fragment);
  }


  function clearPlaceholder() {
    var pins = pinsPlaceholder.querySelectorAll('.map__pin');

    for (var i = 0; i < pins.length - 1; i++) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pins[i].remove();
      }
    }
  }

  function generateCards(objectsJSON) {
    globalCardsArray = [];

    // Создадим и заполним фрагмент
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < Math.min(window.kbConstants.PINS_COUNT, objectsJSON.length); i++) {
      // ТЗ, условие 5.2:  Если в объекте с описанием объявления отсутствует поле offer,
      //   то метка объявления не должна отображаться на карте.
      //   Значит, и карточка не должна существовать
      if (!objectsJSON[i].offer) {
        continue;
      }

      var card = window.kbCard.generateCardFromTemplate(objectsJSON[i]);
      card.dataset.index = i.toString();
      card.classList.add('hidden');

      var closeButton = card.querySelector('.popup__close');
      closeButton.addEventListener('click', function (evt) {
        evt.target.parentElement.classList.add('hidden');
      });

      //
      // Обработчик нажатия на клавишу Escape мы привызываем к самому документу, один раз, в main.js
      //

      globalCardsArray.push(card);
      fragment.appendChild(card);
    }

    // Добавляем наполненный DocumentFragment в разметку
    mapElement.insertBefore(fragment, mapFiltersContainer);
  }


  /**
   * Обертка, чтобы вызывать создание и меток, и карточек одним вызовом
   * @param {Array} objectsJSON Массив объектов размещения
   */
  function generatePinsAndCards(objectsJSON) {
    generatePins(objectsJSON);
    generateCards(objectsJSON);
  }


  function reloadMapData(objectsJSON) {
    // Запишем полученные карточки объявлений в глобальную переменную, чтобы можно было фильтровать
    window.kbMap.globalApartmentsJSON = objectsJSON;

    generatePinsAndCards(objectsJSON);

    // Как только объявления загружены, покажем фильтры на карте
    // ТЗ, условие 5.9
    window.kbForm.switchMapFiltersAccess(true);
  }


  function refreshMapPinMainCoords() {
    var coords = mapPinMain.getBoundingClientRect();
    var parentCoords = mapPinMain.parentElement.getBoundingClientRect();

    window.kbMap.globalMapPinMainTailCoords.x = Math.round(coords.left)
      + window.kbConstants.MAP_PIN_MAIN_TAIL_OFFSET.offsetX
      - Math.round(parentCoords.left);
    window.kbMap.globalMapPinMainTailCoords.y = Math.round(coords.top)
      + window.kbConstants.MAP_PIN_MAIN_TAIL_OFFSET.offsetY
      - Math.round(parentCoords.top);
  }

  /**
   * Заполнение поля адреса координатами метки
   */
  function fillAddressFromPinMain() {
    refreshMapPinMainCoords();

    window.kbForm.addressField.value = window.kbMap.globalMapPinMainTailCoords.x
      + ', ' + window.kbMap.globalMapPinMainTailCoords.y;
  }


  function showCard(cardID) {
    for (var i = 0; i < globalCardsArray.length; i++) {
      if (!globalCardsArray[i].classList.contains('hidden') && i.toString() !== cardID) {
        globalCardsArray[i].classList.add('hidden');
      }

      if (i.toString() === cardID) {
        globalCardsArray[i].classList.remove('hidden');
      }
    }

  }

  /**
   * Обработчик клика по меткам объявлений
   * @param {*} evt Событие
   * @listens {event} evt Событие
   */
  function onPinClick(evt) {
    if (typeof evt !== 'object' || evt.button !== 0) {
      return;
    }

    showCard(evt.currentTarget.dataset.index);
  }


  // Инициализация

  // Глобальный массив для хранения объявлений с сервера
  var globalApartmentsJSON = [];


  // Глобальный массив для хранения карточек объявлений.
  // Потому что нормального способа передать в обработчик метки ссылку на карточку - нет.
  var globalCardsArray = [];


  // Найдем блок для размещения меток
  var pinsPlaceholder = document.querySelector('.map__pins');

  // Главная метка на карте
  var mapPinMain = document.querySelector('.map__pin--main');

  // Координаты острого конца метки
  var globalMapPinMainTailCoords = {
    x: 0,
    y: 0
  };


  // Карта
  var mapElement = document.querySelector('.map');
  // Элемент, перед которым нужно вставить блок карточек
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  window.kbMap = {
    globalApartmentsJSON: globalApartmentsJSON,
    mapElement: mapElement,
    mapFiltersContainer: mapFiltersContainer,

    mapPinMain: mapPinMain,
    globalMapPinMainTailCoords: globalMapPinMainTailCoords,

    generatePinsAndCards: generatePinsAndCards,
    reloadMapData: reloadMapData,

    fillAddressFromPinMain: fillAddressFromPinMain,

    showCard: showCard
  };

})();
