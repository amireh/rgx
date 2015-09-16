var React = require("react");
var appStore = require("AppStore");
var DialectPicker = require("components/DialectPicker");

var Landing = React.createClass({
  displayName: "Landing",

  render() {
    return(
      <div className="landing">
        <h2>Welcome, expressionist.</h2>

        <p>
          <code>[:rgx:]</code> is a beautiful, powerful <strong>regular
          expression editor </strong> that supports a large number of regex
          dialects (or languages, or flavors!)
        </p>

        <p>
          Primarily, the editor revolves around the following features:
        </p>

        <ul>
          <li>Real-time expression testing and match highlighting</li>
          <li>Testing of expressions against multiple subjects</li>
          <li>
            Generating <em>permalinks</em> to constructs so they can be
            shared and reviewed later using a URL
          </li>

          <li>A public registry for sharing constructs</li>
          <li>More. <em>Secrets!</em></li>
        </ul>

        <h2>Try it. Pick your flavor</h2>

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

        <h2>Obligatory Misc: What's with the awkward name?</h2>

        <p>
          It's the only remaining name that is remotely-relevant and has a
          matching, available domain left on the internets. Very sad.
        </p>
      </div>
    );
  }
});

module.exports = Landing;