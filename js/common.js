'use strict';

(function () {
  var common = {
    checkForEmptyValue: function (value) {
      var noValue = '...';
      return (value ? value : noValue).toString();
    },

    findAncestor: function (target, parentClassName) {
      while ((target = target.parentElement) && !target.classList.contains(parentClassName));
      return target;
    },

    clearEditForm: function () {
      document.querySelector('#edit-id').textContent = '';
      document.querySelector('#edit-hid').textContent = '';
      document.querySelector('#edit-name').textContent = '';
      document.querySelector('#edit-adress').textContent = '';
      document.querySelector('#edit-phone').textContent = '';
    },

    clearAddForm: function () {
      document.querySelector('#add-id').textContent = '';
      document.querySelector('#add-hid').textContent = '';
      document.querySelector('#add-name').textContent = ''
      document.querySelector('#add-adress').textContent = ''
      document.querySelector('#add-phone').textContent = ''
    }
  };

  window.common = common;
})();
