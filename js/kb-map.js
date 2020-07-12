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

      fragment.appendChild(
          window.kbPin.generatePinFromTemplate(objectsJSON[i])
      );
    }

    // Добавляем наполненный DocumentFragment в разметку
    pinsPlaceholder.innerHTML = '';
    pinsPlaceholder.appendChild(fragment);
  }

  function generateCards(objectsJSON) {
    // Создадим и заполним фрагмент
    var fragment = document.createDocumentFragment();

    // for (var i = 0; i < Math.min(window.kbConstants.PINS_COUNT, objectsJSON.length); i++) {
    for (var i = 0; i < 1; i++) {
      // ТЗ, условие 5.2:  Если в объекте с описанием объявления отсутствует поле offer,
      //   то метка объявления не должна отображаться на карте.
      //   Значит, и карточка не должна существовать
      if (!objectsJSON[i].offer) {
        continue;
      }

      fragment.appendChild(
          window.kbCard.generateCardFromTemplate(objectsJSON[i])
      );
    }


    // Добавляем наполненный DocumentFragment в разметку
    mapElement.insertBefore(fragment, mapFiltersContainer);
  }


  function generatePinsAndCards(objectsJSON) {
    generatePins(objectsJSON);
    generateCards(objectsJSON);
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
    if (typeof evt === 'object' && evt.button === 0) {
      // Активировать страницу
      window.main.activatePage();

      // Заполнить поле адреса
      fillAddressFromPinMain();
    }
  }

  // Инициализация

  // Найдем блок для размещения меток
  var pinsPlaceholder = document.querySelector('.map__pins');

  // Главная метка на карте
  var mapPinMain = document.querySelector('.map__pin--main');

  // Карта
  var mapElement = document.querySelector('.map');
  // Элемент, перед которым нужно вставить блок карточек
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  window.kbMap = {
    generatePinsAndCards: generatePinsAndCards,

    fillAddressFromPinMain: fillAddressFromPinMain,

    onMapPinMainClick: onMapPinMainClick
  };

})();
