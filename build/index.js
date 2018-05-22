"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "wireframe", {
  enumerable: true,
  get: function () {
    return _wireframe.default;
  }
});
Object.defineProperty(exports, "bootstrap", {
  enumerable: true,
  get: function () {
    return _bootstrap.default;
  }
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _html = require("html");

var _wireframe = _interopRequireDefault(require("./wireframe"));

var _bootstrap = _interopRequireDefault(require("./bootstrap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const writeDoctype = ctx => ctx.res.write('<!doctype html>\n');

const writeHtml = ctx => {
  ctx.type = 'html';
  ctx.status = 200;
  writeDoctype(ctx);
};

const makeStreamRender = _static => {
  const render = _static ? _server.renderToStaticNodeStream : _server.renderToNodeStream;
  return (ctx, WebSite) => {
    writeHtml(ctx);
    const stream = render(WebSite);
    ctx.body = stream;
  };
};
/**
 * A middleware constructor.
 * @param {function} reducer
 * @param {object} actions
 * @param {function} View
 * @param {function} render
 * @returns {Koa.Middleware}
 */


const makeStore = (reducer, actions, View, render) => {
  return async (ctx, next) => {
    const store = (0, _redux.createStore)(reducer);
    ctx.store = store;
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
/**
 * Convert action creators from `actions` config into action dispatchers in the
 * context.
 * @param {object} actions
 * @param {object} ctx
 * @param {{dispatch:function}} store
 */


const assignContextActions = (actions, ctx, store) => {
  Object.keys(actions).forEach(key => {
    const fn = actions[key];

    ctx[key] = (...args) => {
      const action = fn(...args);
      store.dispatch(action);
    };
  });
};
/**
 * @typedef {Object} Config
 * @property {function} View A Redux connected container.
 * @property {function} [reducer] A root reducer to create the store.
 * @property {Object} [actions] A map of action creators.
 * @property {boolean} [static=true] String React's hydration metadata (default true)
 * @property {boolean} [pretty=false] Render formatted HTML (default false)
 * @property {(ctx, Website) => void} [render] An optional render function for more control in rendering.
 */


const makeMarkupRender = (_static, pretty) => {
  const render = _static ? _server.renderToStaticMarkup : _server.renderToString;
  return (ctx, WebSite) => {
    writeHtml(ctx);
    const m = render(WebSite);
    const s = pretty ? (0, _html.prettyPrint)(m) : m;
    ctx.body = s;
  };
};

const getRender = (_static, pretty) => {
  if (pretty) return makeMarkupRender(_static, pretty);
  return makeStreamRender(_static);
};
/**
 * @param {Config} config
 */


const fn = (config = {}) => {
  const {
    View,
    reducer = () => ({}),
    actions = {},
    static: _static = true,
    pretty = false,
    render = null
  } = config;
  const r = render || getRender(_static, pretty);
  const Store = makeStore(reducer, actions, View, r);
  return Store;
};

var _default = fn;
exports.default = _default;
//# sourceMappingURL=index.js.map