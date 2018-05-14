'use strict';

(function () {
  var EDIT_BUTTON = document.querySelector('.edit-form__button');
  var ADD_BUTTON = document.querySelector('.add-form__button');
  var CANCEL_EDIT_BUTTON = document.querySelector('.cancel_edit_button');
  var CLEAR_LOCAL_STORAGE_BUTTON = document.querySelector('.clearLocalStorage-form__button');
  var EDIT_FORM = document.querySelector('.edit-popup');
  var TABLE_BODY = document.querySelector('.table__body');
  var SHOW_ALL_BUTTON = document.querySelector('.show-all-button');
  var OVERLAY = document.querySelector('.overlay');

  var JSON_TYPE = 'application/json';
  var JSON_MAX_SIZE = 5242880;

  var INVALID_TYPE_MESSAGE = 'Загрузите .json файл';
  var INVALID_SIZE_MESSAGE = 'Максимальный размер файла 5мб';

  var onCancelEditBtnClick = function () {
    window.common.clearEditForm();
    EDIT_FORM.classList.add('hidden');
    document.querySelector('.marked_row').classList.remove('marked_row');
    OVERLAY.classList.remove('modal_open');
  };

  CANCEL_EDIT_BUTTON.addEventListener('click', onCancelEditBtnClick);

  var createNewEntrity = function (entrity) {
    return '<tr class="table__row">'
      + '<td class="table__cell_hidden" style="font-size: 20px;">-</td>'
      + '<td class="table__cell" id="id">' + window.common.checkForEmptyValue(entrity.id) + '</td>'
      + '<td class="table__cell" id="hid">' + window.common.checkForEmptyValue(entrity.hid) + '</td>'
      + '<td class="table__cell" id="name">' + window.common.checkForEmptyValue(entrity.full_name) + '</td>'
      + '<td class="table__cell" id="adress">' + window.common.checkForEmptyValue(entrity.address) + '</td>'
      + '<td class="table__cell" id="phone">' + window.common.checkForEmptyValue(entrity.phone) + '</td>'
      + '<td class="table__cell_button"><button class="deleteButton"><svg class="icon icon-cross"'
      + 'tabindex="0"><use xlink:href="#icon-cross"/></svg></button></td>'
      + '<td class="table__cell_button"><button class="editButton"><svg class="icon icon-pencil"'
      + 'tabindex="0"><use xlink:href="#icon-pencil"/></svg></button></td>'
      + '</tr>';
  };

  var fetchAll = function (array) {
    array.sort(function (first, second) {
      return first.hid - second.hid;
    }).forEach(function (it) {
      TABLE_BODY.insertAdjacentHTML('beforeEnd', createNewEntrity(it));
    });
    CLEAR_LOCAL_STORAGE_BUTTON.addEventListener('click', window.backend.clearLocalStorage);
  };

  var newOrg = {};

  var addNewEntrity = function () {
    var newOrgId = document.querySelector('#add-id').value;
    var newOrgHid = document.querySelector('#add-hid').value;
    var newOrgName = document.querySelector('#add-name').value;
    var newOrgAdress = document.querySelector('#add-adress').value;
    var newOrgPhone = document.querySelector('#add-phone').value;

    newOrg.id = window.common.checkForEmptyValue(newOrgId);
    newOrg.hid = window.common.checkForEmptyValue(newOrgHid);
    newOrg.full_name = window.common.checkForEmptyValue(newOrgName);
    newOrg.address = window.common.checkForEmptyValue(newOrgAdress);
    newOrg.phone = window.common.checkForEmptyValue(newOrgPhone);

    TABLE_BODY.insertAdjacentHTML('beforeEnd', createNewEntrity(newOrg));
    window.common.clearAddForm();
    window.backend.sendJSON();
  };

  ADD_BUTTON.addEventListener('click', addNewEntrity);

  document.addEventListener('click', function (evt) {
    if (evt.target.closest('.editButton')) {
      var editRow = window.common.findAncestor(evt.target, 'table__row');
      EDIT_FORM.classList.remove('hidden');
      editRow.classList.add('marked_row');
      OVERLAY.classList.add('modal_open');

      document.querySelector('#edit-id').value = editRow.querySelector('#id').textContent;
      document.querySelector('#edit-hid').value = editRow.querySelector('#hid').textContent;
      document.querySelector('#edit-name').value = editRow.querySelector('#name').textContent;
      document.querySelector('#edit-adress').value = editRow.querySelector('#adress').textContent;
      document.querySelector('#edit-phone').value = editRow.querySelector('#phone').textContent;

      var onSubmitBtnClick = function () {
        editRow.querySelector('#id').textContent = document.querySelector('#edit-id').value;
        editRow.querySelector('#hid').textContent = document.querySelector('#edit-hid').value;
        editRow.querySelector('#name').textContent = document.querySelector('#edit-name').value;
        editRow.querySelector('#adress').textContent = document.querySelector('#edit-adress').value;
        editRow.querySelector('#phone').textContent = document.querySelector('#edit-phone').value;
        EDIT_FORM.classList.add('hidden');
        EDIT_BUTTON.removeEventListener('click', onSubmitBtnClick);
        editRow.classList.remove('marked_row');
        OVERLAY.classList.remove('modal_open');
        window.backend.sendJSON();
      };
      EDIT_BUTTON.addEventListener('click', onSubmitBtnClick);
    } else if (evt.target.closest('.deleteButton')) {
      var deleteRow = window.common.findAncestor(evt.target, 'table__row');
      deleteRow.remove();
      window.backend.sendJSON();
    } else if (evt.target.closest('.table__cell_hidden')) {
      var hideRow = window.common.findAncestor(evt.target, 'table__row');
      var hideRowCell = hideRow.querySelectorAll('td');
      hideRowCell.forEach(function (it, i) {
        if (i !== 0) {
          it.classList.toggle('hidden');
          it.parentNode.classList.toggle('table__row_hidden');
        }
      });
      if (hideRowCell[1].classList.contains('hidden')) {
        evt.target.textContent = '+';
      } else {
        evt.target.textContent = '-';
      }
    }
  });

  var onShowAllButtonClick = function () {
    var hiddenCell = document.querySelectorAll('td.hidden');
    var hideButtonIcon = document.querySelectorAll('.table__cell_hidden');
    if (hiddenCell.length > 0) {
      hiddenCell.forEach(function (it, i) {
        if (!it.classList.contains('table__cell_hidden')) {
          it.classList.remove('hidden');
          it.parentNode.classList.remove('table__row_hidden');
        }
        if (hideButtonIcon[i]) {
          hideButtonIcon[i].textContent = '-';
        }
      });
    } else {
      document.querySelectorAll('td').forEach(function (it, i) {
        if (!it.classList.contains('table__cell_hidden')) {
          it.classList.add('hidden');
          it.parentNode.classList.add('table__row_hidden');
        }
        if (hideButtonIcon[i]) {
          hideButtonIcon[i].textContent = '+';
        }
      });
    }
  };

  SHOW_ALL_BUTTON.addEventListener('click', function () {
    window.debounce(onShowAllButtonClick);
  });

  var LOAD_FORM = document.querySelector('.load-form');

  LOAD_FORM.addEventListener('change', function (evt) {
    var dataBaseFile = evt.target.files[0];
    var isValidType = dataBaseFile.type === JSON_TYPE;
    var isValidSize = dataBaseFile.size < JSON_MAX_SIZE;
    if (isValidType && isValidSize) {
      window.backend.sendLocalDB(URL.createObjectURL(dataBaseFile), 'GET');
    } else if (!isValidType) {
      alert(INVALID_TYPE_MESSAGE);
    } else if (!isValidSize) {
      alert(INVALID_SIZE_MESSAGE);
    }
  });

  var checkLocalStorage = function () {
    if (window.localStorage.LPU) {
      fetchAll((JSON.parse(window.localStorage.LPU)).LPU);
    }
  };

  checkLocalStorage();

  window.fetchAll = fetchAll;
})();
