'use strict';

(function () {

  /**
   * Показывает сообщение об успехе отправки данных на сервер
   * @param {string} [message]
   */
  function showSuccess(message) {
    var successDialog = document.querySelector('#success').content
      .querySelector('.success')
      .cloneNode(true);

    if (message) {
      successDialog.querySelector('.success__message').textContent = message;
    }

    // По клику самоубьемся
    successDialog.addEventListener('click', function () {
      successDialog.remove();
    });

    document.querySelector('main').appendChild(successDialog);
  }


  /**
   * Показывает собщение об ошибке отправки даных на сервер или ошибке загрузки объявлений
   * @param {string} [message]
   */
  function showError(message) {
    var errorDialog = document.querySelector('#error').content
      .querySelector('.error')
      .cloneNode(true);

    if (errorDialog) {
      errorDialog.querySelector('.error__message').textContent = message;
    }

    // По клику самоубьемся
    errorDialog.addEventListener('click', function () {
      errorDialog.remove();
    });

    document.querySelector('main').appendChild(errorDialog);
  }


  //
  // Экспорт
  //

  window.kbMessages = {
    showSuccess: showSuccess,
    showError: showError
  };

})();
