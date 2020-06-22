'use strict';

(function () {
  /**
   * Переключение состояния страницы (блокировка/разблокировка)
   * @param {boolean} isActivate Активировать?
   */
  function switchPageActiveState(isActivate) {
    var mapControl = document.querySelector('.map');
    var mapFiltersContainer = document.querySelector('.map__filters-container');
    var mapFilters = mapFiltersContainer.querySelectorAll('select, fieldset');

    var adForm = document.querySelector('.ad-form');
    var adFormFieldSets = adForm.querySelectorAll('fieldset');

    // Установим соответствующее состояние полям ввода
    window.kbForm.switchControlsAccess(mapFilters, isActivate);
    window.kbForm.switchControlsAccess(adFormFieldSets, isActivate);

    if (isActivate) {
      // Включим карту
      mapControl.classList.remove('map--faded');

      // Включим элементы управления
      adForm.classList.remove('ad-form--disabled');

    } else {
      // Отключим карту
      mapControl.classList.add('map--faded');

      // Отключим элементы управления
      adForm.classList.add('ad-form--disabled');
    }
  }

  /**
   * Активация страницы
   */
  function activatePage() {
    switchPageActiveState(true);

    // Покажем на карте случайные метки
    window.kbMap.generatePins();
  }

  /**
   * Деактивация страницы
   */
  function deactivatePage() {
    switchPageActiveState(false);
  }


  // Инициализация

  // Деактивируем страницу
  deactivatePage();

  // Навесим событие на главный Pin
  var mapPinMain = document.querySelector('.map__pin--main');
  mapPinMain.addEventListener('click', window.kbMap.onMapPinMainClick);

  // И заполним адрес значениями этого Pin-а
  window.kbMap.fillAddressFromPinMain();

  // Навесим события на input-ы формы создания объявления
  window.kbForm.adForm.querySelector('#timein').addEventListener('change', window.kbForm.onAdFormChange);
  window.kbForm.adForm.querySelector('#timeout').addEventListener('change', window.kbForm.onAdFormChange);

  window.kbForm.adForm.querySelector('#type').addEventListener('change', window.kbForm.onAdFormChange);

  window.kbForm.adForm.querySelector('#room_number').addEventListener('change', window.kbForm.onAdFormChange);
  window.kbForm.adForm.querySelector('#capacity').addEventListener('change', window.kbForm.onAdFormChange);
  // Обновим состояние, чтобы валидность проверялась даже без изменения инпутов
  window.kbForm.changeCapacityValidity(
      window.kbForm.adForm.querySelector('#room_number'),
      window.kbForm.adForm.querySelector('#capacity')
  );


  window.main = {
    activatePage: activatePage
  };

})();
