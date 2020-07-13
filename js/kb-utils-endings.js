'use strict';

(function () {

  /**
   * Выбор слова с подходящим окончанием в зависимости от количества
   * @param {int} n Количество
   * @param {Array} titles Массив слов для выбора, например ['комната', 'комнаты', 'комнат']);
   * @return {string}
   */
  function endOfNum(n, titles) {
    /* Было вот так красивенько, но зануда npm test говорит, что "Do not nest ternary expressions"
       Значит, сделаем некрасиво, а это оставим на память.
    return titles[(n % 10 === 1 && n % 100 !== 11)
      ? 0
      : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
        ? 1
        : 2];
     */

    if (n % 10 === 1 && n % 100 !== 11) {
      return titles[0];
    }

    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
      return titles[1];
    }

    return titles[2];
  }

  window.kbUtilsEndings = {
    endOfNum: endOfNum
  };

})();
