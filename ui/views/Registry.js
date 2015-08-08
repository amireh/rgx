const React = require('react');
const md5 = require('blueimp-md5');
const { Link } = require('react-router');
const Editor = require('components/Editor');
const Icon = require('components/Icon');
const appStore = require('AppStore');
const EditorStore = require('EditorStore');
const ResultStore = require('ResultStore');
const ConstructStore = require('ConstructStore');
const RouteActions = require('actions/RouteActions');
const Actions = require('Actions');
const classSet = require('utils/classSet');
const { sortByAll } = require('lodash');

const Registry = React.createClass({
  // getInitialState: function() {
  //   return {
  //     loading: true
  //   };
  // },

  getDefaultProps: function() {
    return {
      params: {}
    };
  },

  componentWillMount: function() {
    ConstructStore.fetch();
  },

  componentDidMount: function() {
    ConstructStore.addChangeListener(this.reload);
    EditorStore.addChangeListener(this.reload);
    ResultStore.addChangeListener(this.reload);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.params.id) {
      if (
        prevProps.params.id !== this.props.params.id ||
        EditorStore.getConstructId() !== this.props.params.id
      ) {
        this.inspect(this.getConstruct());
      }
    }
  },

  componentWillUnmount: function() {
    ResultStore.removeChangeListener(this.reload);
    EditorStore.removeChangeListener(this.reload);
    ConstructStore.removeChangeListener(this.reload);
  },

  render: function() {
    const inspectedId = this.props.params.id;
    const constructs = ConstructStore.getAll();

    return (
      <div className="registry">
        {constructs.length === 0 && (
          <p>
            There are no browsable constructs yet.
          </p>
        )}

        {constructs.length > 0 && (
          <ul className="registry-listing">
            {constructs.map(this.renderConstruct)}
          </ul>
        )}

        <div className="registry-inspector">
          {inspectedId && this.renderInspector()}
        </div>
      </div>
    );
  },

  renderConstruct(c) {
    const className = classSet({
      'registry-entry': true,
      'registry-entry--active': c.id === this.props.params.id
    });

    return (
      <li
        key={c.id}
        onClick={this.visitConstruct.bind(null, c.id)}
        className={className}
      >
        <span className="type-mute">
          {c.dialect}
        </span>

        {' '}

        {c.description}

        <span className="registry-entry__rating">
          <Icon className="icon-arrow-down" onClick={this.downVote.bind(null, c.id)} />
          {' ' + (c.stars || 0) + ' '}
          <Icon className="icon-arrow-up" onClick={this.upVote.bind(null, c.id)} />
        </span>
      </li>
    );
  },

  renderInspector() {
    const c = this.getConstruct();

    if (!c) {
      return null;
    }

    return (
      <div>
        <h1>{c.title}</h1>

        {c.description.length > 0 && (
          <p>{c.description}</p>
        )}

        <p className="type-small">-By <strong>{c.author}</strong></p>

        <Editor
          readOnly
          dialect={c.dialect}
          pattern={EditorStore.getPattern()}
          subjects={EditorStore.getSubjects()}
          flags={EditorStore.getFlags()}
          meta={EditorStore.getMeta()}
          activeSubjectId={EditorStore.getActiveSubjectId()}
          availableFlags={appStore.getAvailableFlags(c.dialect)}
          results={ResultStore.getAll()}
          permalink={c.href}
        />
      </div>
    );
  },

  reload() {
    this.forceUpdate();
  },

  visitConstruct(id) {
    RouteActions.transitionTo("registry", { id });
  },

  inspect(c) {
    EditorStore.use(c, () => {
      if (this.isMounted()) {
        Actions.submit(c.dialect);
      }
    });
  },

  getConstruct() {
    const { id } = this.props.params;

    return ConstructStore.getAll().filter(function(c) {
      return c.id === id;
    })[0];
  },

  downVote(id) {
    Actions.vote(id, 0);
  },

  upVote(id) {
    Actions.vote(id, 1)
  }
});

module.exports = Registry;