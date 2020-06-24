'use strict';

(function () {
  /**
   * Получение случайного целого числа в заданном интервале, включительно
   * @param {int} min
   * @param {int} max
   * @return {int} Случайное число
   */
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
  }

  window.kbUtils = {
    getRandomIntInclusive: getRandomIntInclusive
  };

})();
