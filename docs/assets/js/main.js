/* global document, Fuse */
'use strict';

var search = (function () {
  var getItems = function () {
    return Array.prototype.slice.call(document.querySelectorAll('.js-sassdoc__item')).map(function (item) {
      return {
        name: item.dataset.name,
        type: item.dataset.type,
        node: item
      };
    });
  };

  var options = {
    keys: ['name'],
    threshold : 0.3
  };

  var items = getItems();
  var index = new Fuse(items, options);

  return index.search.bind(index);
})();


(function (search) {
  var searchForm = document.querySelector('#js-search');
  var searchInput = document.querySelector('#js-search-input');
  var searchSuggestions = document.querySelector('#js-search-suggestions');

  var currentSelection = -1;
  var selected;
  var suggestions = [];

  var fillSuggestions = function (items) {
    searchSuggestions.innerHTML = '';
    suggestions = items.slice(0, 10).map(function (item) {
      var li = document.createElement('li');
      
      li.dataset.type = item.type;
      li.dataset.name = item.name;
      li.innerHTML = '<a href="#' + item.type + '-' + item.name + '"><code>' + item.type.slice(0, 3) + '</code> ' + item.name + '</a>';

      searchSuggestions.appendChild(li);
      return li;
    });
  };

  var performSearch = function (term) {
    var result = search(term);
    fillSuggestions(result);
  };

  searchSuggestions.addEventListener('click', function (e) {
    if (e.target.nodeName === 'A') {
      searchInput.value = e.target.parentNode.dataset.name;
      fillSuggestions([]);
    }
  });

  searchForm.addEventListener('keyup', function (e) {
    e.preventDefault();

    // Enter
    if (e.keyCode === 13) {
      if (selected) {
        fillSuggestions([]);
        searchInput.value = selected.dataset.name;
        window.location = selected.childNodes[0].href;
      }

      e.stopPropagation();
    }

    // KeyDown
    if (e.keyCode === 40) {
      currentSelection = (currentSelection + 1) % suggestions.length;
    }

    // KeyUp
    if (e.keyCode === 38) {
      currentSelection = currentSelection - 1;
      if (currentSelection < 0) {
        currentSelection =  suggestions.length - 1;
      }
    }

    if (suggestions[currentSelection]) {
      if (selected) {
        selected.classList.remove('selected');
      }

      selected = suggestions[currentSelection];
      selected.classList.add('selected');
    }

  });

  searchInput.addEventListener('keyup', function (e) {
    if (e.keyCode !== 40 && e.keyCode !== 38) {
      currentSelection = -1;
      performSearch(searchInput.value);
    } 

    else {
      e.preventDefault();
    }
  });

  searchInput.addEventListener('search', function () {
    performSearch(searchInput.value);
  });
})(search);
