var appStore = require('AppStore');
var ConstructStore = require('ConstructStore');
var editorStore = require('EditorStore');
var resultStore = require('ResultStore');
var { findWhere, pluck, debounce, extend } = require('lodash');
var ajax = require('utils/ajax');
var { THROTTLE } = require("constants");

var debouncedSubmit;

exports.updatePattern = function(dialect, pattern) {
  editorStore.setPattern(pattern);
  debouncedSubmit(dialect);
};

exports.updateFlags = function(dialect, flags) {
  const availableFlags = pluck(appStore.getAvailableFlags(dialect), 'name');
  const validFlags = flags.split('').filter(function(flag) {
    return availableFlags.indexOf(flag) > -1;
  }).join('');

  editorStore.setFlags(validFlags);

  debouncedSubmit(dialect);
};

exports.addSubject = function() {
  editorStore.addSubject();
};

exports.activateSubject = function(id) {
  var subject = findWhere(editorStore.state.subjects, { id });

  if (subject) {
    editorStore.setState({ activeSubjectId: id });
  }
  else {
    console.warn('Unable to find subject with id %s', id);
  }
};

exports.updateSubjectAttrs = function(id, customAttrs) {
  var subject = findWhere(editorStore.state.subjects, { id });

  if (subject) {
    subject.customAttrs = customAttrs;
  }
  else {
    console.warn('Unable to find subject with id %s', id);
  }
};

exports.updateSubjectText = function(dialect, id, newText) {
  var subject = findWhere(editorStore.state.subjects, { id });

  if (subject) {
    subject.text = newText;
    editorStore.emitChange();
    debouncedSubmit(dialect);
  }
  else {
    console.warn('Unable to find subject with id %s', id);
  }
};

exports.submit = function(dialect) {
  var subjects = editorStore.getSubjects();
  var params = {
    pattern: editorStore.getPattern(),
    subjects: pluck(subjects, 'text'),
    flags: editorStore.getFlags()
  };

  ajax({
    url: `/api/dialects/${dialect}`,
    type: 'POST',
    data: JSON.stringify(params),
  }, function(payload) {
    resultStore.setState({
      results: payload.map(function(result, i) {
        return {
          result: result,
          subjectId: subjects[i].id
        };
      })
    });
  }, appStore.setError.bind(appStore));
};

debouncedSubmit = debounce(exports.submit, THROTTLE, {
  leading: false, trailing: true
});

exports.dismissError = function() {
  appStore.clearError();
};

exports.dismissInternalError = function() {
  appStore.clearInternalError();
};

/**
 * Called on every route transition. Here we get to clean up any state that
 * should not be carried across the pages, like error notifications.
 */
exports.clearTransientState = function() {
  exports.dismissError();
  exports.dismissInternalError();
};

exports.clearGenerationResults = function() {
  resultStore.setState({
    permalink: undefined,
    publishedConstruct: undefined
  });
};

function saveConstruct(dialect, customParams, done) {
  var subjects = editorStore.getSubjects();
  var params = extend({}, customParams, {
    dialect: dialect,
    pattern: editorStore.getPattern(),
    subjects: pluck(subjects, 'text'),
    flags: editorStore.getFlags()
  });

  ajax({
    url: '/api/registry',
    type: 'POST',
    data: JSON.stringify(params),
  }, done, appStore.setError.bind(appStore));
}

exports.generatePermalink = function(dialect) {
  saveConstruct(dialect, { public: false }, function(payload) {
    resultStore.setState({
      permalink: payload
    });
  });
};

exports.publish = function(dialect, customParams, done) {
  saveConstruct(dialect, customParams, function(doc) {
    resultStore.setState({
      publishedConstruct: doc
    });

    done();
  });
};

exports.retrievePermalink = function(permalink) {
  ajax({ url: `/api/registry/${permalink}` }, function(payload) {
    editorStore.clearState();
    editorStore.use(payload);
    exports.submit(payload.dialect);
  }, appStore.setError.bind(appStore));
};

exports.vote = function(docId, upOrDown) {
  ajax({
    url: `/api/registry/${docId}/${upOrDown ? 'upvote' : 'downvote'}`,
    type: 'PATCH'
  }, function(newDoc) {
    console.log(docId, `was ${upOrDown ? 'up voted' : 'down voted'}`, 'down to', newDoc.stars);
    ConstructStore.update(docId, newDoc);
  }, appStore.setError.bind(appStore));
};