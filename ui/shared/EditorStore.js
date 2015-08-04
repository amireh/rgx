var Store = require('Store');
var appStore = require('AppStore');
var subjectUUID = 0;

class EditorStore extends Store {
  getInitialState() {
    return {
      pattern: '',
      subjects: [{ id: `s${subjectUUID}`, position: 1, text: '' }],
      flags: '',
      activeSubjectId: null,
    };
  }

  getPattern() {
    return this.state.pattern;
  }

  setPattern(newPattern) {
    this.setState({ pattern: newPattern });
  }

  setFlags(newFlags) {
    this.setState({ flags: newFlags });
  }

  getSubjects() {
    return this.state.subjects;
  }

  addSubject(activate) {
    var subject = {
      id: `s${++subjectUUID}`,
      position: this.state.subjects.length+1,
      text: ''
    };

    this.state.subjects.push(subject);

    if (activate !== false) {
      this.setState({ activeSubjectId: subject.id });
    }

    return subject;
  }

  getFlags() {
    return this.state.flags;
  }

  getActiveSubjectId() {
    return this.state.activeSubjectId || (
      this.state.subjects.length ? this.state.subjects[0].id : null
    );
  }
}

module.exports = new EditorStore();