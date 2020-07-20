'use strict';

(function () {

  /**
   * Оптимизированная функция устранения дребезга
   *   в отличие от примера в демонстрации, сначала выполняет действие, а уже потом ждет.
   * @param {function(...[*]=)} cb Функция, вызов которой ограничиваем
   * @return {function(...[*]=)}
   */
  function debounceEnclosed(cb) {
    var lastTimeout = null;

    return function () {
      if (!lastTimeout) {
        cb.apply(null, arguments);

        lastTimeout = window.setTimeout(function () {
          lastTimeout = null;

          // И в конце еще раз вызовем входящую функцию,
          //   чтобы отработать состояние элементов после последнего клика.
          cb.apply(null, arguments);
        }, window.kbConstants.DEBOUNCE_INTERVAL);
      }
    };
  }

  /**
   * Функция устранения дребезга из демонстрации code and magic
   *   ее минус в том, что она дает задержку первого срабатывания, это неприятно.
   * @param {function(...[*]=)} cb Функция, вызов которой ограничиваем
   * @return {function(...[*]=)}
   */
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

  /**
   * Одиночный устранитель дребезга (если используется только он один в проекте)
   * @param {function(...[*]=)} cb Функция, вызов которой ограничиваем
   */
  function debounceSingle(cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, window.kbConstants.DEBOUNCE_INTERVAL);
  }


  //
  // Экспорт
  //

  window.kbDebouncer = {
    debounceEnclosed: debounceEnclosed,

    debounceEnclosedWait: debounceEnclosedWait,
    debounceSingle: debounceSingle
  };

})();
