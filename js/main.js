'use strict';

(function () {

  /**
   * Активация страницы
   */
  function activatePage() {
    // Запустим загрузку меток.
    // Только после загрузки меток покажем фильтры на карте (см reloadMapData)!
    window.kbBackend.loadData(
        window.kbMap.reloadMapData,
        window.kbMessages.errorMessage
    );
  }


  /**
   * Деактивация страницы
   */
  function deactivatePage() {
    window.kbForm.switchAdFormControlsAccess(false);
    window.kbForm.switchMapFiltersAccess(false);
  }


  function onDocumentEscapeKeyDown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      // Скрыть карточки объявлений
      window.kbMap.showCard();

      // Поищем и уничтожим сообщение об успехе
      document.querySelector('main').querySelectorAll('.success').forEach(function (it) {
        it.remove();
      });

      // Поищем и уничтожим сообщение об ошибке
      document.querySelector('main').querySelectorAll('.error').forEach(function (it) {
        it.remove();
      });
    }
  }


  // Инициализация

  // Деактивируем страницу
  deactivatePage();

  // Навесим событие на главный Pin
  // window.kbMap.mapPinMain.addEventListener('click', window.kbMap.onMapPinMainClick);
  window.kbMap.mapPinMain.addEventListener('mousedown', window.kbMover.onMapPinMainMouseDown);

  // Заполним поле адреса координатами
  window.kbMap.fillAddressFromPinMain();


  // Навесим обработчики на форму фильтра объявлений на карте.
  //   Навешиваем на саму форму, так как мы все равно опрашиваем все input-ы
  // И еще воспользуемся приемом для устрания дребезка при обновлении фильтра
  window.kbMap.mapFiltersContainer.addEventListener('change',
      window.kbDebouncer.debounceEnclosed(window.kbForm.onMapFilterChange));


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


  // Навесим обработчик клавиши Escape для закрытия карточек, скрытия алертов
  document.addEventListener('keydown', onDocumentEscapeKeyDown);


  // Навесим обработчик на нажатие кнопки Отправить
  window.kbForm.adForm.addEventListener('submit', window.kbForm.onAdFormSubmit);


  window.main = {
    activatePage: activatePage,
    deactivatePage: deactivatePage
  };

})();
