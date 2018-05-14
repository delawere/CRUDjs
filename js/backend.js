'use strict';

(function () {
  var CLEAR_LOCAL_STORAGE_BUTTON = document.querySelector('.clearLocalStorage-form__button');
  var ERROR_MESSAGE = 'Произошла ошибка: ';
  var SUCCESS_MESSAGE = 'БД успешно загружена';

  var backend = {
    sendJSON: function () {
      var updateDB = [];
      var table = document.querySelectorAll('tr');
      table.forEach(function (it, i) {
        if (i !== 0) {
          var currentObject = {
            id: it.querySelector('#id').textContent,
            hid: it.querySelector('#hid').textContent,
            full_name: it.querySelector('#name').textContent,
            address: it.querySelector('#adress').textContent,
            phone: it.querySelector('#phone').textContent,
          };
          updateDB.push(currentObject);
        }
      });
      var updateJSON = {};
      updateJSON.LPU = updateDB;
      localStorage.setItem('LPU', JSON.stringify(updateJSON));
    },

    sendLocalDB: function (url, method) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, false);

      xhr.send();

      if (xhr.status !== 200) {
        alert(ERROR_MESSAGE + xhr.status);
      } else {
        alert(SUCCESS_MESSAGE);
        localStorage.setItem('LPU', xhr.response);

        window.fetchAll((JSON.parse(window.localStorage.LPU)).LPU);
      }
    },

    clearLocalStorage: function () {
      localStorage.removeItem('LPU');
      CLEAR_LOCAL_STORAGE_BUTTON.removeEventListener('click', backend.checkLocalStorage);
    }
  };

  window.backend = backend;
})();
