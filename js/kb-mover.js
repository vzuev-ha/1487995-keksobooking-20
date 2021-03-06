'use strict';
(function () {

  /**
   * Обработчик перемещения главной метки
   * @param {*} evt Событие
   * @listens {event} evt Событие
   */
  function onMapPinMainMouseDown(evt) {
    if (typeof evt !== 'object' || evt.button !== 0) {
      return;
    }

    evt.preventDefault();

    // Активировать страницу, если она не была активирована
    if (window.kbMap.mapControl.classList.contains('map--faded')) {
      window.main.activatePage();
    }

    // Снять выделение с меток
    window.kbMap.activatePin();
    // Скрыть карточки объявлений, если они были видны
    window.kbMap.showCard();


    var mapPinMain = window.kbMap.mapPinMain;
    mapPinMain.focus();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      // Обновим координаты хвоста метки и заполним поле адреса координатами
      window.kbMap.fillAddressFromPinMain();

      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // Проконтролируем, чтобы хвост метки не вылез за границы
      var mapPinMainLeft = mapPinMain.offsetLeft - shift.x;
      var mapPinMainTop = mapPinMain.offsetTop - shift.y;

      mapPinMainLeft = Math.max(
          mapPinMainLeft,
          window.kbConstants.PIN_X_MIN - window.kbConstants.MAP_PIN_MAIN_TAIL_OFFSET.offsetX
      );
      mapPinMainLeft = Math.min(
          mapPinMainLeft,
          window.kbConstants.PIN_X_MAX - window.kbConstants.MAP_PIN_MAIN_TAIL_OFFSET.offsetX
      );

      mapPinMainTop = Math.max(
          mapPinMainTop,
          window.kbConstants.PIN_Y_MIN - window.kbConstants.MAP_PIN_MAIN_TAIL_OFFSET.offsetY
      );
      mapPinMainTop = Math.min(
          mapPinMainTop,
          window.kbConstants.PIN_Y_MAX - window.kbConstants.MAP_PIN_MAIN_TAIL_OFFSET.offsetY
      );

      mapPinMain.style.left = mapPinMainLeft + 'px';
      mapPinMain.style.top = mapPinMainTop + 'px';
    }

    function onClickPreventDefault(clickEvt) {
      clickEvt.preventDefault();
      mapPinMain.removeEventListener('click', onClickPreventDefault);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      // Обновим координаты хвоста метки и заполним поле адреса координатами
      window.kbMap.fillAddressFromPinMain();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        mapPinMain.addEventListener('click', onClickPreventDefault);
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }


  //
  // Экспорт
  //

  window.kbMover = {
    onMapPinMainMouseDown: onMapPinMainMouseDown
  };

})();
