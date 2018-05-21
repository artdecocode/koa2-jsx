"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * This is the main template wrapper which can add title, links, external
 * scripts, javascript blocks and styles.
 */
const View = ({
  title,
  children,
  scripts = [],
  links = [],
  styles = [],
  js = [],
  viewport
}) => {
  return _react.default.createElement("html", {
    lang: "en"
  }, _react.default.createElement("head", null, _react.default.createElement("meta", {
    charSet: "utf-8"
  }), viewport && _react.default.createElement("meta", {
    name: "viewport",
    content: viewport
  }), _react.default.createElement("title", null, title), links.map((props, i) => _react.default.createElement("link", _extends({
    key: i
  }, props))), styles.map((style, i) => _react.default.createElement("style", {
    key: i,
    dangerouslySetInnerHTML: {
      __html: style
    }
  }))), _react.default.createElement("body", null, children, scripts.map((props, i) => _react.default.createElement("script", _extends({
    key: i
  }, props))), js.map((script, i) => _react.default.createElement("script", {
    key: i,
    dangerouslySetInnerHTML: {
      __html: script
    }
  }))));
};

var _default = View;
exports.default = _default;
//# sourceMappingURL=View.js.map