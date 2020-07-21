'use strict';

(function () {

  /**
   * Создание HTML-ноды "Метка" из объекта размещения на основе шаблона
   * @param {Object} apartmentObject Объект размещения
   * @return {ActiveX.IXMLDOMNode | Node}
   */
  function generatePinFromTemplate(apartmentObject) {
    var pin = pinTemplate.cloneNode(true);

    var pinLeft = apartmentObject.location.x - Math.round(window.kbConstants.PIN_DIMENSIONS.width / 2);
    var pinTop = apartmentObject.location.y - window.kbConstants.PIN_DIMENSIONS.height;

    pin.style = 'left: ' + pinLeft + 'px; top: ' + pinTop + 'px;';
    pin.children[0].src = apartmentObject.author.avatar;
    pin.children[0].alt = apartmentObject.offer.title;

    return pin;
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
    generatePinFromTemplate: generatePinFromTemplate
  };

})();
