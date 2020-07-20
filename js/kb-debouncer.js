'use strict';

(function () {

  // Оптимизированная функция устранения дребезга
  //   в отличие от примера в демонстрации, сначала выполняет действие, а уже потом ждет.
  function debounceEnclosed(cb) {
    var lastTimeout = null;

    return function () {
      if (!lastTimeout) {
        cb.apply(null, arguments);

        lastTimeout = window.setTimeout(function () {
          lastTimeout = null;
        }, window.kbConstants.DEBOUNCE_INTERVAL);
      }
    };
  }

  // Функция устранения дребезга из демонстрации code and magic
  //   ее минус в том, что она дает задержку первого срабатывания, это неприятно.
  function debounceEnclosedWait(cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, window.kbConstants.DEBOUNCE_INTERVAL);
    };
  }


  // Одиночный устранитель дребезга (если используется только он один в проекте)
  var lastTimeout;

  function debounceSingle(cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, window.kbConstants.DEBOUNCE_INTERVAL);
  }

  window.kbDebouncer = {
    debounceEnclosed: debounceEnclosed,

    debounceEnclosedWait: debounceEnclosedWait,
    debounceSingle: debounceSingle
  };

})();
