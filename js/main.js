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
   * Деактивация страницы. Используется локально.
   */
  function deactivatePage() {
    window.kbForm.switchAdFormControlsAccess(false);
    window.kbForm.switchMapFiltersAccess(false);
  }


  /**
   * Сброс и деактивация страницы. Используется извне.
   */
  function resetAndDeactivatePage() {
    window.kbMap.reloadMapData([]);

    var adForm = window.kbForm.adForm;
    adForm.reset();
    var mapFiltersForm = window.kbMap.mapFiltersForm;
    mapFiltersForm.reset();

    var mapPinMain = window.kbMap.mapPinMain;
    mapPinMain.style.left = window.kbConstants.MAP_PIN_MAIN_LEFT_TOP_COORDS.x + 'px';
    mapPinMain.style.top = window.kbConstants.MAP_PIN_MAIN_LEFT_TOP_COORDS.y + 'px';

    document.querySelector(window.kbConstants.AVATAR_PREVIEW_CLASS).src = window.kbConstants.AVATAR_DEFAULT_IMAGE_SRC;
    document.querySelector(window.kbConstants.PHOTO_PREVIEW_CLASS).src = '';

    // Поскольку штатный reset срабатывает в конце обработчика, надо заполнить адрес с задержкой,
    //   иначе он тоже почистится
    window.setTimeout(function () {
      window.kbMap.fillAddressFromPinMain();
    }, window.kbConstants.AD_FORM_RESET_TIMEOUT);

    deactivatePage();
  }


  /**
   * Глобальный обработчик Escape
   * @param {*} evt Событие
   * @listens {event} evt Событие
   */
  function onDocumentEscapeKeyDown(evt) {
    // Критерий Б26 требует, чтобы обработчики создавались и удалялись.
    //   Если следовать критерию, этот обработчик нужно распилить на три штуки
    //   и разнести в модули card и messages.
    //   Но тогда код, принадлежащий основной странице, становится рассредоточенным,
    //   и его тяжелее обслуживать (искать все обработчики document по разным файлам).

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


  //
  // Инициализация
  //

  // Деактивируем страницу
  deactivatePage();


  // Навесим событие на главный Pin
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


  // Навесим обработчики на нажатие кнопки Отправить и Очистить
  window.kbForm.adForm.addEventListener('submit', window.kbForm.onAdFormSubmit);
  window.kbForm.adForm.addEventListener('reset', window.kbForm.onAdFormReset);


  // Навесим обработчик на выбор аватарки
  var avatarInput = window.kbForm.adForm.querySelector('.ad-form-header__input');
  avatarInput.addEventListener('change', window.kbFiles.onFileChooserChange);
  avatarInput.dataset.preview = window.kbConstants.AVATAR_PREVIEW_CLASS;

  // Навесим обработчик на загрузку фото жилья
  var photoInput = window.kbForm.adForm.querySelector('.ad-form__input');
  photoInput.addEventListener('change', window.kbFiles.onFileChooserChange);
  photoInput.dataset.preview = window.kbConstants.PHOTO_PREVIEW_CLASS;


  //
  // Экспорт
  //

  window.main = {
    activatePage: activatePage,
    resetAndDeactivatePage: resetAndDeactivatePage
  };

})();
