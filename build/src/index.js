"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.prettyRender = exports.bootstrap = exports.wireframe = void 0;

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _html = require("html");

var wf = _interopRequireWildcard(require("./wireframe"));

var _bootstrap = _interopRequireDefault(require("./bootstrap"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wireframe = wf;
exports.wireframe = wireframe;
const bootstrap = _bootstrap.default;
exports.bootstrap = bootstrap;

const writeDoctype = ctx => ctx.res.write('<!doctype html>\n');

const writeHtml = ctx => {
  ctx.type = 'html';
  ctx.status = 200;
  writeDoctype(ctx);
};

const defaultRender = (ctx, WebSite) => {
  writeHtml(ctx);
  const stream = (0, _server.renderToStaticNodeStream)(WebSite);
  ctx.body = stream;
};
/**
 * Render html with indentation.
 */


const prettyRender = (ctx, WebSite) => {
  writeHtml(ctx);
  const markup = (0, _server.renderToStaticMarkup)(WebSite);
  const s = (0, _html.prettyPrint)(markup);
  ctx.body = s;
};

exports.prettyRender = prettyRender;

const makeStore = (reducer, actions, View, render) => {
  return async (ctx, next) => {
    const store = (0, _redux.createStore)(reducer);
    assignContextActions(actions, ctx, store);
    await next(); // so instead of giving you a function to render to include in middleware
    // chain, I just include render as the very last operation, assuming no
    // implications but there could be e.g., for error page.

    if (!ctx.Content) {
      return;
    }

    const WebSite = _react.default.createElement(_reactRedux.Provider, {
      store: store
    }, _react.default.createElement(View, null, ctx.Content));

    render(ctx, WebSite);
  };
};

const assignContextActions = (actions, ctx, store) => {
  Object.keys(actions).forEach(key => {
    const fn = actions[key];

    ctx[key] = (...args) => {
      const action = fn(...args);
      store.dispatch(action);
    };
  });
};

var _default = config => {
  const {
    View,
    reducer,
    render = defaultRender,
    actions = {},
    pretty = false
  } = config;
  const r = pretty == true ? prettyRender : render;
  const Store = makeStore(reducer, actions, View, r);
  return Store;
};

exports.default = _default;