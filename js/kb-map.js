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
    pinsPlaceholder.innerHTML = '';
    pinsPlaceholder.appendChild(fragment);
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

  /**
   * Заполнение поля адреса координатами метки
   */
  function fillAddressFromPinMain() {
    var x = parseInt(mapPinMain.style.left + Math.round(mapPinMain.style.width / 2), 10);
    var y = parseInt(mapPinMain.style.top + mapPinMain.style.height, 10);

    window.kbForm.addressField.value = x + ', ' + y;
  }


  /**
   * Обработчик клика по главной метке
   * @param {*} evt Событие
   * @listens {event} evt Событие
   */
  function onMapPinMainClick(evt) {
    if (typeof evt !== 'object' || evt.button !== 0) {
      return;
    }

    // Активировать страницу
    window.main.activatePage();

    // Заполнить поле адреса
    fillAddressFromPinMain();
  }


  function toggleCards(cardID) {
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

    toggleCards(evt.currentTarget.dataset.index);
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

  // Карта
  var mapElement = document.querySelector('.map');
  // Элемент, перед которым нужно вставить блок карточек
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  window.kbMap = {
    globalApartmentsJSON: globalApartmentsJSON,
    mapFiltersContainer: mapFiltersContainer,

    generatePinsAndCards: generatePinsAndCards,
    reloadMapData: reloadMapData,

    fillAddressFromPinMain: fillAddressFromPinMain,

    onMapPinMainClick: onMapPinMainClick,

    toggleCards: toggleCards
  };

})();
