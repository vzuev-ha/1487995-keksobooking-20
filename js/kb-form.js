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


  function isPinAvailable(it) {
    var housingType = window.kbMap.mapFiltersContainer.querySelector('#housing-type').value;
    var isHousingType = (housingType && housingType !== 'any') ? (it.offer.type === housingType) : true;

    var housingPrice = window.kbMap.mapFiltersContainer.querySelector('#housing-price').value;
    var isHousingPrice = true;
    if (housingPrice) {
      switch (housingPrice) {
        case 'middle':
          isHousingPrice = it.offer.price >= 10000 && it.offer.price <= 50000;
          break;
        case 'low':
          isHousingPrice = it.offer.price < 10000;
          break;
        case 'high':
          isHousingPrice = it.offer.price > 50000;
          break;
      }
    }

    var housingRooms = window.kbMap.mapFiltersContainer.querySelector('#housing-rooms').value;
    var isHousingRooms = (housingRooms && housingRooms !== 'any')
      ? (it.offer.rooms.toString() === housingRooms)
      : true;

    var housingGuests = window.kbMap.mapFiltersContainer.querySelector('#housing-guests').value;
    var isHousingGuests = (housingGuests && housingGuests !== 'any')
      ? (it.offer.guests.toString() === housingGuests)
      : true;


    var housingWifi = window.kbMap.mapFiltersContainer.querySelector('#filter-wifi').checked;
    var isHousingWifi = housingWifi ? (it.offer.features.indexOf('wifi') !== -1) : true;

    var housingDishwasher = window.kbMap.mapFiltersContainer.querySelector('#filter-dishwasher').checked;
    var isHousingDishwasher = housingDishwasher ? (it.offer.features.indexOf('dishwasher') !== -1) : true;

    var housingParking = window.kbMap.mapFiltersContainer.querySelector('#filter-parking').checked;
    var isHousingParking = housingParking ? (it.offer.features.indexOf('parking') !== -1) : true;

    var housingWasher = window.kbMap.mapFiltersContainer.querySelector('#filter-washer').checked;
    var isHousingWasher = housingWasher ? (it.offer.features.indexOf('washer') !== -1) : true;

    var housingElevator = window.kbMap.mapFiltersContainer.querySelector('#filter-elevator').checked;
    var isHousingElevator = housingElevator ? (it.offer.features.indexOf('elevator') !== -1) : true;

    var housingConditioner = window.kbMap.mapFiltersContainer.querySelector('#filter-conditioner').checked;
    var isHousingConditioner = housingConditioner ? (it.offer.features.indexOf('conditioner') !== -1) : true;


    return isHousingType && isHousingPrice && isHousingRooms && isHousingGuests &&
      isHousingWifi && isHousingDishwasher && isHousingParking &&
      isHousingWasher && isHousingElevator && isHousingConditioner;
  }


  function onMapFilterChange() {
    // Закроем открытую карточку
    window.kbMap.showCard();

    var ApartmentsJSON = window.kbMap.globalApartmentsJSON.filter(function (it) {
      return isPinAvailable(it);
    });

    window.kbMap.generatePinsAndCards(ApartmentsJSON);
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


  function switchMapFiltersAccess(isActivate) {
    var mapControl = document.querySelector('.map');
    var mapFiltersContainer = document.querySelector('.map__filters-container');
    var mapFilters = mapFiltersContainer.querySelectorAll('select, fieldset');

    // Установим соответствующее состояние полям ввода
    switchControlsAccess(mapFilters, isActivate);

    // И покажем/скроем
    if (isActivate) {
      mapControl.classList.remove('map--faded');
    } else {
      mapControl.classList.add('map--faded');
    }
  }

  function switchAdFormControlsAccess(isActivate) {
    var adForm = document.querySelector('.ad-form');
    var adFormFieldSets = adForm.querySelectorAll('fieldset');

    // Установим соответствующее состояние полям ввода
    switchControlsAccess(adFormFieldSets, isActivate);

    // И покажем/скроем
    if (isActivate) {
      adForm.classList.remove('ad-form--disabled');
    } else {
      adForm.classList.add('ad-form--disabled');
    }
  }

  function onAdFormSubmit(evt) {
    window.kbBackend.submitData(
        new FormData(adForm),
        submitSuccess,
        window.kbMessages.errorMessage
    );

    evt.preventDefault();
  }


  function submitSuccess() {
    window.kbMap.reloadMapData([]);

    adForm.reset();
    window.main.deactivatePage();

    window.kbMessages.successMessage();
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
    switchMapFiltersAccess: switchMapFiltersAccess,
    switchAdFormControlsAccess: switchAdFormControlsAccess,

    onMapFilterChange: onMapFilterChange,

    onAdFormSubmit: onAdFormSubmit
  };

})();
