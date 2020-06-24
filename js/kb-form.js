'use strict';

(function () {

  /**
   * Обработчик изменения формы создания объявления. Единый для всех полей.
   * @param {*} evt Событие
   * @listens {event} evt Событие
   */
  function onAdFormChange(evt) {
    // Делаем все проверки в одном обработчике, так легче управлять кодом
    if (!evt.target) {
      return;
    }

    switch (evt.target.id) {
      case 'timein':
        adForm.querySelector('#timeout').value = evt.target.value;
        break;
      case 'timeout':
        adForm.querySelector('#timein').value = evt.target.value;
        break;
      case 'type':
        var minPrice = window
          .kbConstants
          .APARTMENT_TYPE_MIN_PRICES[window.kbConstants.APARTMENT_TYPES.indexOf(evt.target.value)];
        adForm.querySelector('#price').min = minPrice;
        adForm.querySelector('#price').placeholder = minPrice;
        break;
      case 'room_number':
        changeCapacityValidity(evt.target, adForm.querySelector('#capacity'));
        break;
      case 'capacity':
        changeCapacityValidity(adForm.querySelector('#room_number'), evt.target);
        break;
    }
  }

  /**
   * Установка CustomValidity для поля Capacity (вместимость)
   * @param {HTMLSelectElement} roomInput Поле ввода количества комнат
   * @param {HTMLSelectElement} guestInput Поле ввода количества гостей
   */
  function changeCapacityValidity(roomInput, guestInput) {
    var roomNum = parseInt(roomInput.value, 10);
    var guestNum = parseInt(guestInput.value, 10);

    // Найдем массив возможных значений Кол-ва гостей для данного Кол-ва комнат
    // Делаем это при помощи двух массивов - один с ключами, другой - со значениями
    // Поскольку find по массиву объектов нам пока нельзя ;)
    var roomValue = window.kbConstants.ROOMS_VALUE[window.kbConstants.ROOMS_KEY.indexOf(roomNum)];
    if (roomValue) {
      // Если такое количество гостей во-можно - стираем ошибку, иначе - обновляем из массива
      if (roomValue.guests.includes(guestNum)) {
        guestInput.setCustomValidity('');
      } else {
        guestInput.setCustomValidity(roomValue.message);
      }
    } else {
      guestInput.setCustomValidity('');
    }
  }

  /**
   * Устанавливает или снимает всем элементам в коллекции свойство disabled
   * @param {NodeListOf<Element>} controlsArray Коллекция элементов
   * @param {boolean} isEnabled Доступен?
   */
  function switchControlsAccess(controlsArray, isEnabled) {
    for (var i = 0; i < controlsArray.length - 1; i++) {
      controlsArray[i].disabled = !isEnabled;
    }
  }


  // Инициализация
  // Найдем форму создания объявления и экспортируем ее
  var adForm = document.querySelector('.ad-form');

  var addressField = adForm.querySelector('#address');

  window.kbForm = {
    adForm: adForm,
    addressField: addressField,

    onAdFormChange: onAdFormChange,
    changeCapacityValidity: changeCapacityValidity,
    switchControlsAccess: switchControlsAccess
  };

})();
