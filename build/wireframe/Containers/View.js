"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _View = _interopRequireDefault(require("../Components/View"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extract properties for the view component from the state.
 */
var _default = (0, _reactRedux.connect)(state => state)(_View.default);

exports.default = _default;
//# sourceMappingURL=View.js.map