var Store = require('Store');
var appStore = require('AppStore');
var subjectUUID = 0;

function generateSubjectUUID() {
  return `s${++subjectUUID}`;
}

class EditorStore extends Store {
  getInitialState() {
    return {
      pattern: '',
      subjects: [{ id: `s${subjectUUID}`, position: 1, text: '' }],
      flags: '',
      activeSubjectId: null,
      meta: {}
    };
  }

  use(c, done) {
    this.clearState();
    this.setState({
      id: c.id,
      pattern: c.pattern,
      subjects: c.subjects.map(function(text, i) {
        return {
          id: generateSubjectUUID(),
          position: i,
          text: text
        };
      }),
      flags: c.flags,
      meta: {
        description: c.description,
        author: c.author,
        public: c.public,
        stars: c.stars
      }
    }, done);
  }

  getConstructId() {
    return this.state.id;
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

  setMeta(meta) {
    this.setState({ meta });
  }

  getSubjects() {
    return this.state.subjects;
  }

  addSubject(activate) {
    var subject = {
      id: generateSubjectUUID(),
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

  getMeta() {
    return this.state.meta;
  }
}


module.exports = new EditorStore();
