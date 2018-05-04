"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.js = exports.css = void 0;

const addCss = ctx => {
  ctx.setViewport('width=device-width, initial-scale=1, shrink-to-fit=no');
  ctx.addCss([['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css', ...(process.env.NODE_ENV === 'production' ? ['sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm', 'anonymous'] : [])]]);
};

const addJs = ctx => {
  ctx.addScript([['https://code.jquery.com/jquery-3.2.1.slim.min.js', ...(process.env.NODE_ENV === 'production' ? ['sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN', 'anonymous'] : [])], ['https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js', ...(process.env.NODE_ENV === 'production' ? ['sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q', 'anonymous'] : [])], ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js', ...(process.env.NODE_ENV === 'production' ? ['sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl', 'anonymous'] : [])]]);
};

const css = async (ctx, next) => {
  addCss(ctx);
  await next();
};

exports.css = css;

const js = async (ctx, next) => {
  addJs(ctx);
  await next();
};

exports.js = js;

const bootstrap = async (ctx, next) => {
  addCss(ctx);
  addJs(ctx);
  await next();
};

var _default = bootstrap;
exports.default = _default;