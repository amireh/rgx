const React = require("react");
const appStore = require("AppStore");
const DialectPicker = require("components/DialectPicker");
const { Link } = require('react-router');

const Landing = React.createClass({
  render() {
    return(
      <div className="landing">
        <h2>Welcome, expressionist.</h2>

        <p>
          <code>[:rgx:]</code> is a <strong>regular expression editor </strong>
          that supports a large number of regex dialects (or languages, or flavors!)
        </p>

        <p>
          Primarily, the editor revolves around the following features:
        </p>

        <ul>
          <li>Real-time expression testing and match highlighting</li>
          <li>Testing of expressions against <strong>multiple subjects</strong></li>
          <li>
            Generating <strong>permalinks</strong> to constructs so they can be
            <strong> shared</strong> and <strong>reviewed later</strong> with a URL
          </li>

          <li>A public <Link to="registry">registry</Link> for sharing constructs</li>
          <li>More. <em>Secrets!</em></li>
        </ul>

        <h2>Try it. Pick a flavor:</h2>

        <DialectPicker
          listMode
          availableDialects={appStore.getAvailableDialects()}
        />

        <p>
          Can't find the dialect you're looking for?
          {' '}
          <a href="https://github.com/amireh/rgx/issues" target="_blank">Tell us</a>
          {' '}
          about it, or even add it yourself.
        </p>

        <h2>What's with the awkward name?</h2>

        <p>
          It's the only remaining name that is remotely-relevant and has a
          matching, available domain left on the internets. Very sad.
        </p>
      </div>
    );
  }
});

module.exports = Landing;