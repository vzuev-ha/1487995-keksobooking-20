'use strict';

(function () {

  /**
   * Создание HTML-ноды "Карточка" из объекта размещения на основе шаблона
   * @param {{offer: {features: [], rooms: number, address: string, checkin: string, price: number, guests: number, description: string, title: string, type: string, checkout: string, photos: []}, author: {avatar: string}, location: {x: number, y: number}}} apartmentObject Объект размещения
   * @return {ActiveX.IXMLDOMNode | Node}
   */
  function generateCardFromTemplate(apartmentObject) {
    var card = cardTemplate.cloneNode(true);

    // Заголовок
    card.querySelector('.popup__title')
      .textContent = apartmentObject.offer.title ? apartmentObject.offer.title : 'Безымянный объект...';

    // Адрес
    var address = card.querySelector('.popup__text--address');
    if (apartmentObject.offer.address) {
      address.textContent = apartmentObject.offer.address;
    } else {
      address.classList.add('hidden');
    }

    // Цена
    var price = card.querySelector('.popup__text--price');
    if (apartmentObject.offer.price) {
      price.textContent = apartmentObject.offer.price + ' \u20bd/ночь';
    } else {
      price.classList.add('hidden');
    }

    // Тип жилья
    var type = card.querySelector('.popup__type');
    // Как и c другими блоками, нам необходимо скрыть этот блок, если apartmentObject.offer.type отсутствует.
    // Но в данном случае indexOf вернет -1, если параметр не определен, так что отдельная проверка не нужна.
    // Хотя это и снижает восприятие кода, без этого коммента читателю придется догадываться о наличии этой логики...
    var typeIndex = window.kbConstants.APARTMENT_TYPES.indexOf(apartmentObject.offer.type);

    if (typeIndex >= 0) {
      type.textContent = window.kbConstants.APARTMENT_TYPES_RUS[typeIndex];
    } else {
      type.classList.add('hidden');
    }

    // Кол-во гостей и комнат
    var capacity = card.querySelector('.popup__text--capacity');
    var capacityText = '';

    if (apartmentObject.offer.rooms) {
      capacityText = apartmentObject.offer.rooms + ' ' + window.kbUtilsEndings
        .endOfNum(apartmentObject.offer.rooms, window.kbConstants.PLURAL_ENDINGS_ROOM);
    }

    if (apartmentObject.offer.guests) {
      capacityText += ' для ' + apartmentObject.offer.guests + ' ' + window.kbUtilsEndings
        .endOfNum(apartmentObject.offer.guests, window.kbConstants.PLURAL_ENDINGS_GUEST);
    }

    if (capacityText !== '') {
      capacity.textContent = capacityText;
    } else {
      capacity.classList.add('hidden');
    }


    // Время заезда и выезда
    var time = card.querySelector('.popup__text--time');
    if (apartmentObject.offer.checkin && apartmentObject.offer.checkout) {
      time.textContent = 'Заезд после ' + apartmentObject.offer.checkin + ', выезд до ' + apartmentObject.offer.checkout;
    } else {
      time.classList.add('hidden');
    }


    // Удобства
    var features = card.querySelector('.popup__features');
    if (apartmentObject.offer.features && apartmentObject.offer.features.length > 0) {

      if (apartmentObject.offer.features.indexOf('wifi') < 0) {
        card.querySelector('.popup__feature--wifi').classList.add('hidden');
      }
      if (apartmentObject.offer.features.indexOf('dishwasher') < 0) {
        card.querySelector('.popup__feature--dishwasher').classList.add('hidden');
      }
      if (apartmentObject.offer.features.indexOf('parking') < 0) {
        card.querySelector('.popup__feature--parking').classList.add('hidden');
      }
      if (apartmentObject.offer.features.indexOf('washer') < 0) {
        card.querySelector('.popup__feature--washer').classList.add('hidden');
      }
      if (apartmentObject.offer.features.indexOf('elevator') < 0) {
        card.querySelector('.popup__feature--elevator').classList.add('hidden');
      }
      if (apartmentObject.offer.features.indexOf('conditioner') < 0) {
        card.querySelector('.popup__feature--conditioner').classList.add('hidden');
      }
    } else {
      features.classList.add('hidden');
    }


    // Описание
    var description = card.querySelector('.popup__description');
    if (apartmentObject.offer.description) {
      description.textContent = apartmentObject.offer.description;
    } else {
      description.classList.add('hidden');
    }

    // Фотографии
    var photos = card.querySelector('.popup__photos');
    if (apartmentObject.offer.photos && apartmentObject.offer.photos.length > 0) {
      // Найдем шаблонный элемент для фотографий
      var photoPrototype = photos.querySelector('.popup__photo');

      apartmentObject.offer.photos.forEach(function (photoSrc) {
        var photo = photoPrototype.cloneNode();
        photo.src = photoSrc;
        photos.appendChild(photo);
      });

      // Удалим шаблонный элемент для фотографий
      photoPrototype.remove();
    } else {
      photos.classList.add('hidden');
    }

    // Аватарка
    var avatar = card.querySelector('.popup__avatar');
    if (apartmentObject.author.avatar) {
      avatar.src = apartmentObject.author.avatar;
    } else {
      avatar.src = window.kbConstants.USER_DEFAULT_IMAGE_SRC;
    }

    return card;
  }


  //
  // Инициализация
  //

  var cardTemplate = document.querySelector('#card').content
    .querySelector('.map__card');


  //
  // Экспорт
  //

  window.kbCard = {
    generateCardFromTemplate: generateCardFromTemplate
  };

})();
