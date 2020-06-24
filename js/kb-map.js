'use strict';

(function () {
  /**
   * Генерация тестовых меток на карте
   */
  function generatePins() {
    // Создадим и заполним фрагмент
    var fragment = document.createDocumentFragment();
    var pinsArray = [];

    for (var i = 0; i < window.kbConstants.PINS_COUNT; i++) {
      pinsArray[i] = window.kbPin
        .generatePinFromTemplate(window.kbMockData.generateApartment(i + 1));
      fragment.appendChild(pinsArray[i]);
    }

    // Создаем DocumentFragment, наполненный метками, и добавляем его в разметку
    pinsPlaceholder.appendChild(fragment);
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


  window.kbMap = {
    generatePins: generatePins,

    fillAddressFromPinMain: fillAddressFromPinMain,

    onMapPinMainClick: onMapPinMainClick
  };

})();
