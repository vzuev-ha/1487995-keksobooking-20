'use strict';

(function () {
  var submitURL = 'https://javascript.pages.academy/keksobooking';

  var dataURL = 'https://javascript.pages.academy/keksobooking/data';

  var StatusCode = {
    OK: 200
  };
  var TIMEOUT_IN_MS = 10000;


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


  function submitData(data, onSuccess, onError) {
    var xhr = prepareXMLHttpRequest(onSuccess, onError);

    try {
      xhr.open('POST', submitURL);
      xhr.send(data);
    } catch (e) {
      onError(e.message);
    }
  }


  window.kbBackend = {
    loadData: loadData,
    submitData: submitData
  };

})();
