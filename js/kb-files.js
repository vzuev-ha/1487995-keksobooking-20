'use strict';

(function () {

  /**
   * Обработчик выбора файла
   * @param {*} evt Событие
   * @listens {event} evt Событие
   */
  function onFileChooserChange(evt) {
    var file = evt.target.files[0];
    var fileName = file.name.toLowerCase();

    var matches = window.kbConstants.IMAGE_FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        document.querySelector(evt.target.dataset.preview).src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }


  //
  // Экспорт
  //

  window.kbFiles = {
    onFileChooserChange: onFileChooserChange
  };

})();
