'use strict';

(function () {
  // var responseURL = 'https://javascript.pages.academy/code-and-magick';

  var dataURL = 'https://javascript.pages.academy/keksobooking/data';

  var StatusCode = {
    OK: 200
  };
  var TIMEOUT_IN_MS = 10000;

  function networkErrorHandler(errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.right = '0';
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  function prepareXMLHttpRequest(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    return xhr;
  }

  function loadData(onSuccess, onError) {
    var xhr = prepareXMLHttpRequest(onSuccess, onError);

    try {
      xhr.open('GET', dataURL);
      xhr.send();
    } catch (e) {
      onError(e.message);
    }
  }

  /*
  function submitData(data, onSuccess, onError) {
    var xhr = prepareXMLHttpRequest(onSuccess, onError);

    try {
      xhr.open('POST', responseURL);
      xhr.send(data);
    } catch (e) {
      onError(e.message);
    }
  }*/


  window.kbBackend = {
    loadData: loadData,
    networkErrorHandler: networkErrorHandler
  };

})();
