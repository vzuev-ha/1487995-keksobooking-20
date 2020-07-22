'use strict';

(function () {

  /**
   * Генерация меток объявлений на карте
   * @param {Array} objectsJSON Массив данных, полученных по сети
   */
  function generatePins(objectsJSON) {
    // Создадим и заполним фрагмент
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < Math.min(window.kbConstants.MAX_PINS_COUNT, objectsJSON.length); i++) {
      // ТЗ, условие 5.2:  Если в объекте с описанием объявления отсутствует поле offer,
      //   то метка объявления не должна отображаться на карте.
      if (!objectsJSON[i].offer) {
        continue;
      }

      var pin = window.kbPin.generateFromTemplate(objectsJSON[i]);
      pin.dataset.index = i.toString();
      pin.addEventListener('click', onPinClick);

      fragment.appendChild(pin);
    }

    // Добавляем наполненный DocumentFragment в разметку
    clearPinsPlaceholder();
    pinsPlaceholder.appendChild(fragment);
  }


  /**
   * Удаление всех меток объявлений (кроме map__pin--main)
   */
  function clearPinsPlaceholder() {
    var pins = pinsPlaceholder.querySelectorAll('.map__pin');

    pins.forEach(function (it) {
      if (!it.classList.contains('map__pin--main')) {
        it.remove();
      }
    });
  }


  /**
   * Удаление всех карточек объявлений
   */
  function removeAllCards() {
    var cards = mapControl.querySelectorAll('.map__card');

    cards.forEach(function (it) {
      it.remove();
    });
  }


  /**
   * Генерация карточек объявлений
   * @param {Array} objectsJSON Массив данных, полученных по сети
   */
  function generateCards(objectsJSON) {
    globalCardsArray = [];

    // Создадим и заполним фрагмент
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < Math.min(window.kbConstants.MAX_PINS_COUNT, objectsJSON.length); i++) {
      // ТЗ, условие 5.2:  Если в объекте с описанием объявления отсутствует поле offer,
      //   то метка объявления не должна отображаться на карте.
      //   Значит, и карточка не должна существовать
      if (!objectsJSON[i].offer) {
        continue;
      }

      var card = window.kbCard.generateFromTemplate(objectsJSON[i]);
      card.dataset.index = i.toString();
      card.classList.add('hidden');

      var closeButton = card.querySelector('.popup__close');
      closeButton.addEventListener('click', function (evt) {
        evt.target.parentElement.classList.add('hidden');
      });

      //
      // Обработчик нажатия на клавишу Escape мы привызываем не к карточке,
      //   а к самому документу, один раз, в main.js
      //

      globalCardsArray.push(card);
      fragment.appendChild(card);
    }

    // Добавляем наполненный DocumentFragment в разметку
    removeAllCards();
    mapControl.insertBefore(fragment, mapFiltersContainer);
  }


  /**
   * Обертка, чтобы вызывать создание и меток, и карточек одним вызовом
   * @param {Array} objectsJSON Массив объектов размещения
   */
  function generatePinsAndCards(objectsJSON) {
    generatePins(objectsJSON);
    generateCards(objectsJSON);
  }


  /**
   * Обновление данных об объявлениях на карте
   *   Срабатывает в случае успеха загрузки данных по сети
   *   и при сбросе (деактивации) страницы (с пустым массивом объявлений)
   * @param {Array} objectsJSON Массив объектов размещения
   */
  function reloadMapData(objectsJSON) {
    // Запишем полученные карточки объявлений в глобальную переменную, чтобы можно было фильтровать
    window.kbMap.globalApartmentsJSON = objectsJSON;

    generatePinsAndCards(objectsJSON);

    // Как только объявления загружены, покажем фильтры на карте
    // ТЗ, условие 5.9
    window.kbForm.switchMapFiltersAccess(true);

    window.kbForm.switchAdFormControlsAccess(true);
  }


  /**
   * Обновляет глобальныую переменную координат Главной метки при ее перемещении
   *   и смене состояния страницы
   */
  function refreshMapPinMainCoords() {
    var coords = mapPinMain.getBoundingClientRect();
    var parentCoords = mapPinMain.parentElement.getBoundingClientRect();

    // Если карта не активна, мерем координаты центра метки,
    //   иначе - координаты острого конца
    var deltaX;
    var deltaY;
    if (mapControl.classList.contains('map--faded')) {
      deltaX = Math.round(coords.width / 2);
      deltaY = Math.round(coords.height / 2);
    } else {
      deltaX = window.kbConstants.MAP_PIN_MAIN_TAIL_OFFSET.offsetX;
      deltaY = window.kbConstants.MAP_PIN_MAIN_TAIL_OFFSET.offsetY;
    }
    window.kbMap.globalMapPinMainTailCoords.x = Math.round(coords.left)
      + deltaX - Math.round(parentCoords.left);
    window.kbMap.globalMapPinMainTailCoords.y = Math.round(coords.top)
      + deltaY - Math.round(parentCoords.top);
  }


  /**
   * Заполненяет поля адреса координатами метки
   */
  function fillAddressFromPinMain() {
    refreshMapPinMainCoords();

    window.kbForm.addressField.value = window.kbMap.globalMapPinMainTailCoords.x
      + ', ' + window.kbMap.globalMapPinMainTailCoords.y;
  }


  /**
   * Активирует определенную карточку объявления и показывает ее, скрывая остальные.
   * Если идентификатор карточки не передан - скрывает все карточки.
   * @param {string} [cardID] Идентификатор карточки
   */
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
   * Активирует определенную метку и подсвечивает ее, снимая подсветку с остальных.
   * Если метка не передана - снимает подсветку со всех меток.
   * @param {HTMLElement} [clickedPin] Метка, которую необходимо активировать
   */
  function activatePin(clickedPin) {
    var pins = pinsPlaceholder.querySelectorAll('.map__pin');

    pins.forEach(function (it) {
      if (!it.classList.contains('map__pin--main')) {
        if (it === clickedPin) {
          it.classList.add('map__pin--active');
        } else {
          it.classList.remove('map__pin--active');
        }
      }
    });
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

    activatePin(evt.currentTarget);
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


  //
  // Инициализация
  //

  // Карта
  var mapControl = document.querySelector('.map');

  // Элемент, перед которым нужно вставить блок карточек
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  var mapFilters = mapFiltersContainer.querySelectorAll('select, fieldset');

  var mapFiltersForm = mapFiltersContainer.querySelector('.map__filters');


  //
  // Экспорт
  //

  window.kbMap = {
    globalApartmentsJSON: globalApartmentsJSON,

    mapControl: mapControl,
    mapFiltersContainer: mapFiltersContainer,
    mapFilters: mapFilters,
    mapFiltersForm: mapFiltersForm,

    mapPinMain: mapPinMain,
    globalMapPinMainTailCoords: globalMapPinMainTailCoords,

    generatePinsAndCards: generatePinsAndCards,
    reloadMapData: reloadMapData,

    fillAddressFromPinMain: fillAddressFromPinMain,

    showCard: showCard,
    activatePin: activatePin
  };

})();
