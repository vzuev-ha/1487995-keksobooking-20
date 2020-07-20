'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  function onFileChooserChange(evt) {
    var file = evt.target.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
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


  window.kbFiles = {
    onFileChooserChange: onFileChooserChange
  };

})();
