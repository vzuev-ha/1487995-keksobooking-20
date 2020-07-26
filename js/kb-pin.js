'use strict';

(function () {

  /**
   * Создание HTML-ноды "Метка" из объекта размещения на основе шаблона
   * @param {Object} apartmentObject Объект размещения
   * @return {ActiveX.IXMLDOMNode | Node}
   */
  function generateFromTemplate(apartmentObject) {
    var pin = pinTemplate.cloneNode(true);

    var pinLeft = apartmentObject.location.x - Math.round(window.kbConstants.PIN_DIMENSIONS.width / 2);
    var pinTop = apartmentObject.location.y - window.kbConstants.PIN_DIMENSIONS.height;

    pin.style = 'left: ' + pinLeft + 'px; top: ' + pinTop + 'px;';
    pin.children[0].src = apartmentObject.author.avatar;
    pin.children[0].alt = apartmentObject.offer.title;

    return pin;
  }


  /**
   * Проверка, должен ли переданный pin отображаться на карте с учетом активных фильтров
   * @param {Object} it Проверяемый pin
   * @return {boolean}
   */
  function isAvailable(it) {
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


  //
  // Инициализация
  //

  var pinTemplate = document.querySelector('#pin').content
    .querySelector('.map__pin');


  //
  // Экспорт
  //

  window.kbPin = {
    generateFromTemplate: generateFromTemplate,

    isAvailable: isAvailable
  };

})();
