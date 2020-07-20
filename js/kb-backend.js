'use strict';

(function () {

  /**
   * Подготовка HTTP-запроса
   * @param {function(Array)} onSuccess Функция, выполняемая в случае успеха
   * @param {function(string)} onError Функция, выполняемая в случае неудачи
   * @return {XMLHttpRequest} Подготовленный объект Запрос
   */
  function prepareXMLHttpRequest(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.kbConstants.BACKEND_STATUS_CODE.OK) {
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

    xhr.timeout = window.kbConstants.BACKEND_TIMEOUT_IN_MS;

    return xhr;
  }


  /**
   * Загрузка массива данных с внешнего сервера
   * @param {function(Array)} onSuccess Функция, выполняемая в случае успеха
   * @param {function(string)} onError Функция, выполняемая в случае неудачи
   */
  function loadData(onSuccess, onError) {
    var xhr = prepareXMLHttpRequest(onSuccess, onError);

    try {
      xhr.open('GET', window.kbConstants.BACKEND_DATA_URL);
      xhr.send();
    } catch (err) {
      onError(err.message);
    }
  }


  /**
   * Отправка данных формы на внешний сервер
   * @param {FormData} data Данные формы для отправки
   * @param {function(Array)} onSuccess Функция, выполняемая в случае успеха
   * @param {function(string)} onError Функция, выполняемая в случае неудачи
   */
  function submitData(data, onSuccess, onError) {
    var xhr = prepareXMLHttpRequest(onSuccess, onError);

    try {
      xhr.open('POST', window.kbConstants.BACKEND_SUBMIT_URL);
      xhr.send(data);
    } catch (err) {
      onError(err.message);
    }
  }


  //
  // Экспорт
  //

  window.kbBackend = {
    loadData: loadData,
    submitData: submitData
  };

})();
