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
    controlsArray.forEach(function (it) {
      it.disabled = !isEnabled;
    });
  }


  /**
   * Включает/выключает фильтр меток на карте
   * @param {boolean} isActivate
   */
  function switchMapFiltersAccess(isActivate) {
    var mapControl = window.kbMap.mapControl;
    var mapFilters = window.kbMap.mapFilters;
    var mapFiltersContainer = window.kbMap.mapFiltersContainer;

    // Установим соответствующее состояние полям ввода
    switchControlsAccess(mapFilters, isActivate);

    // И покажем/скроем
    if (isActivate) {
      mapControl.classList.remove('map--faded');
      mapFiltersContainer.classList.remove('pointer-events-disabled');
    } else {
      mapControl.classList.add('map--faded');
      mapFiltersContainer.classList.add('pointer-events-disabled');
    }
  }


  /**
   * Включает/выключает форму создания объявления
   * @param {boolean} isActivate
   */
  function switchAdFormControlsAccess(isActivate) {
    // Установим соответствующее состояние полям ввода
    switchControlsAccess(adFormFieldSets, isActivate);

    // И заблокируем/разблокируем форму и ее кнопки
    if (isActivate) {
      adForm.classList.remove('ad-form--disabled');
      adForm.classList.remove('pointer-events-disabled');
    } else {
      adForm.classList.add('ad-form--disabled');
      adForm.classList.add('pointer-events-disabled');
    }
  }


  /**
   * Обработчик события submit - отправки формы
   * @param {*} evt Событие
   * @listens {event} evt Событие
   */
  function onAdFormSubmit(evt) {
    evt.preventDefault();

    window.kbBackend.submitData(
        new FormData(adForm),
        submitSuccess,
        window.kbMessages.showError
    );
  }


  /**
   * Действие в случае успеха отправки формы на сервер
   */
  function submitSuccess() {
    window.main.resetAndDeactivatePage();

    window.kbMessages.showSuccess();
  }


  /**
   * Обработчик нажатия на кнопку reset - ручной сброс формы
   * @listens {event} evt Событие
   */
  function onAdFormResetClick() {
    window.main.resetAndDeactivatePage();
  }


  //
  // Инициализация
  //

  // Найдем форму создания объявления и экспортируем ее
  var adForm = document.querySelector('.ad-form');

  var adFormFieldSets = adForm.querySelectorAll('fieldset');

  var addressField = adForm.querySelector('#address');

  // При инициализации и сбросе формы нам нужно обновить placeholder у поля Цена
  //   Для этого мы будем вызывать change у поля Тим жилья, которое, в свою очередь,
  //   установит нужный placeholder в Цену
  // Для этого запомним и экспортируем ссылку на Тип жилья
  var offerTypeInput = adForm.querySelector('#type');


  //
  // Экспорт
  //

  window.kbForm = {
    adForm: adForm,
    addressField: addressField,

    offerTypeInput: offerTypeInput,

    onAdFormChange: onAdFormChange,
    changeCapacityValidity: changeCapacityValidity,
    switchMapFiltersAccess: switchMapFiltersAccess,
    switchAdFormControlsAccess: switchAdFormControlsAccess,

    onAdFormSubmit: onAdFormSubmit,
    onAdFormResetClick: onAdFormResetClick
  };

})();
