const EventEmitter = require('core/EventEmitter');

let STORAGE_ITEMS = {};
let Storage = EventEmitter([ 'change' ]);

Storage.getItem = function(key) {
  let value;

  console.assert(STORAGE_ITEMS.hasOwnProperty(key),
    `You are attempting to access an unregistered storage key '${key}'.
    Please add this key to core/Storage.js.`
  );

  if (!localStorage.hasOwnProperty(key)) {
    return  STORAGE_ITEMS[key];
  }

  try {
    value = JSON.parse(localStorage.getItem(key));
  }
  catch(e) {
    if (e.name.match(/SyntaxError/)) {
      value = localStorage.getItem(key);
      localStorage.setItem(key, JSON.stringify(value));
    }
    else {
      throw e;
    }
  }
  finally {
    if (value === undefined) {
      value =  STORAGE_ITEMS[key];
    }
  }

  return value;
};

Storage.setItem = function(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  this.emit('change');
};

Storage.clear = function() {
  localStorage.clear();
  this.emit('change');
};

Storage.register = function(key, defaultValue) {
  console.assert(!STORAGE_ITEMS.hasOwnProperty(key),
    `Key ${key} is already taken.`
  );

  STORAGE_ITEMS[key] = defaultValue;
};

module.exports = Storage;