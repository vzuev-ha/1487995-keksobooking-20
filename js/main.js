'use strict';

(function () {

  /**
   * Активация страницы
   */
  function activatePage() {
    // Запустим загрузку меток.
    // Только после загрузки меток покажем фильтры на карте!
    window.kbBackend.loadData(
        window.kbMap.reloadMapData,
        window.kbBackend.networkErrorHandler
    );

    // Но пока метки грузятся, мы можем показать форму ввода
    window.kbForm.switchAdFormControlsAccess(true);
  }


  /**
   * Деактивация страницы
   */
  function deactivatePage() {
    window.kbForm.switchAdFormControlsAccess(false);
    window.kbForm.switchMapFiltersAccess(false);
  }


  // Инициализация

  // Деактивируем страницу
  deactivatePage();

  // Навесим событие на главный Pin
  var mapPinMain = document.querySelector('.map__pin--main');
  mapPinMain.addEventListener('click', window.kbMap.onMapPinMainClick);

  // И заполним адрес значениями этого Pin-а
  window.kbMap.fillAddressFromPinMain();


  // Навесим обработчики на форму фильтра объявлений на карте.
  // На саму форму, так как мы все равно опрашиваем все input-ы
  window.kbMap.mapFiltersContainer.addEventListener('change', window.kbForm.onMapFilterChange);


  // Навесим события на input-ы формы создания объявления
  window.kbForm.adForm.querySelector('#timein').addEventListener('change', window.kbForm.onAdFormChange);
  window.kbForm.adForm.querySelector('#timeout').addEventListener('change', window.kbForm.onAdFormChange);

  var typeInput = window.kbForm.adForm.querySelector('#type');
  typeInput.addEventListener('change', window.kbForm.onAdFormChange);
  // Так как по умолчанию у нас указана квартира, нужно вызвать событие, чтобы значение placeholder изменилось
  typeInput.dispatchEvent(new Event('change'));

  window.kbForm.adForm.querySelector('#room_number').addEventListener('change', window.kbForm.onAdFormChange);
  window.kbForm.adForm.querySelector('#capacity').addEventListener('change', window.kbForm.onAdFormChange);
  // Обновим состояние, чтобы валидность проверялась даже без изменения инпутов
  window.kbForm.changeCapacityValidity(
      window.kbForm.adForm.querySelector('#room_number'),
      window.kbForm.adForm.querySelector('#capacity')
  );


  // Навесим обработку клавиши Escape для закрытия карточек
  // Мы его не будем переиспользовать или удалять, поэтому создадим неименованным
  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      window.kbMap.toggleCards();
    }
  });


  window.main = {
    activatePage: activatePage
  };

})();
