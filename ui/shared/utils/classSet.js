var classSet = require("react/lib/cx");

module.exports = function(classes, ...optional) {
  let className = classes;

  if (optional.length) {
    optional
      .filter(function(staticClassName) {
        return staticClassName && staticClassName.length > 0;
      })
      .forEach(function(staticClassName) {
        className[staticClassName] = true;
      })
    ;
  }

  return classSet(className);
};