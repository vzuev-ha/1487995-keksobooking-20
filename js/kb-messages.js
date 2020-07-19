'use strict';

(function () {

  function successMessage(message) {
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


  function errorMessage(message) {
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


  window.kbMessages = {
    successMessage: successMessage,
    errorMessage: errorMessage
  };

})();