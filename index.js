(function() {
  'use strict';

  var React;
  var TitleShortcutHandler;
  if (typeof require !== 'undefined') {
    React = require('react');
    TitleShortcutHandler = require('title-shortcut-handler');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    TitleShortcutHandler = window.TitleShortcutHandler;
  }

  function Shortcut() {
    React.Component.apply(this, arguments);
  }

  Shortcut._instanceCount = 0;

  Shortcut.handler = null;

  Shortcut.propTypes = {
    meta: React.PropTypes.bool,
    ctrl: React.PropTypes.bool,
    alt: React.PropTypes.bool,
    shift: React.PropTypes.bool,
    char: React.PropTypes.string.isRequired,
    secret: React.PropTypes.bool,
    children: React.PropTypes.node
  };

  Shortcut.defaultProps = {
    meta: false,
    ctrl: false,
    alt: false,
    shift: false,
    secret: false
  };

  Shortcut.prototype = Object.create(React.Component.prototype);

  Object.assign(Shortcut.prototype, {
    componentDidMount: function() {
      Shortcut._instanceCount += 1;
      if (Shortcut._instanceCount === 1) {
        Shortcut.handler = new TitleShortcutHandler();
        this.forceUpdate();
      }
    },

    componentWillUnmount: function() {
      Shortcut._instanceCount -= 1;
      if (Shortcut._instanceCount === 0) {
        Shortcut.handler.destroy();
        Shortcut.handler = null;
      }
    },

    render: function() {
      var child = React.Children.only(this.props.children);

      if (Shortcut.handler === null) {
        return child;
      }

      var shortcut = Shortcut.handler.modifiers
        .filter(function(modifier) {
          return this.props[modifier.toLowerCase()];
        }.bind(this))
        .concat(this.props.char)
        .join(Shortcut.handler.keySeparator)
        .toUpperCase();

      var shortcutProps;
      if (this.props.secret) {
        shortcutProps = {
          'data-shortcut': shortcut
        };
      } else {
        shortcutProps = {
          title: [
            child.props.title,
            '[' + shortcut + ']'
          ].filter(Boolean).join(' ')
        };
      }

      return React.cloneElement(child, shortcutProps);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = Shortcut;
  } else if (typeof window !== undefined) {
    window.ReactKeyboardShortcut = Shortcut;
  }
}());
