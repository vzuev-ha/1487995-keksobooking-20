'use strict';

(function () {

  /**
   * Оптимизированная функция устранения дребезга
   *   в отличие от примера в демонстрации, сначала выполняет действие, а уже потом ждет.
   *   Но у нее тоже есть минусы:
   *     1 - даже если кликнули 1 раз, она выполнит коллбэк минимум 2 раза
   *     2 - как и функция из демонстрации, она игнорирует все промежуточные повторы
   *         (которые произошли до окончания интервала ожидания).
   * В нашем конкретном случае этот вариант лучше. В случае отправки по сети данных лучше функция из примера.
   * @param {function(...[*]=)} cb Функция, вызов которой ограничиваем
   * @return {function(...[*]=)}
   */
  function doEnclosed(cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (!lastTimeout) {
        cb.apply(null, parameters);
      } else {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);

        // После последнего клика сделаем еще одну паузу перед очисткой переменной таймера
        lastTimeout = window.setTimeout(function () {
          lastTimeout = null;
        }, window.kbConstants.DEBOUNCE_INTERVAL);

      }, window.kbConstants.DEBOUNCE_INTERVAL);
    };
  }


  /**
   * Функция устранения дребезга из демонстрации code and magic
   *   ее минус в том, что она не дает выполниться коллбэку, пока не пройдет интервал после последнего клика.
   *   То есть, пользователь тычет в интерфейс, но ничего не происходит, пока он не прекратит. Это недружелюбно.
   * @param {function(...[*]=)} cb Функция, вызов которой ограничиваем
   * @return {function(...[*]=)}
   */
  function doEnclosedWait(cb) {
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
  function doSingle(cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, window.kbConstants.DEBOUNCE_INTERVAL);
  }


  //
  // Экспорт
  //

  window.kbDebouncer = {
    doEnclosed: doEnclosed,

    doEnclosedWait: doEnclosedWait,
    doSingle: doSingle
  };

})();
