"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const mapScript = ([src, integrity, crossOrigin]) => ({
  src,
  integrity,
  crossOrigin
});

const mapCss = ([href, integrity, crossOrigin]) => ({
  href,
  integrity,
  crossOrigin,
  rel: 'stylesheet'
});

const mapIcon = ([href, type, sizes, rel = 'icon']) => ({
  href,
  type,
  sizes,
  rel
});

const actions = {
  /**
   * Set the <title> of the page.
   * @param {string} title The title to use.
   * @returns {Void}
   */
  setTitle: title => ({
    type: 'SET_TITLE',
    title
  }),

  /**
   * Add an external script tag on the page.
   * @param {string|[string, string, string][]} scripts The script(s) to add.
   * If a single string is passed, it's added as a source. If an array is passed,
   * it must contain array elements of the following format:
   * `[src, integrity, origin]`.
   *
   * For example,
   * ```
   * addScript('/js/bundle.js')
   * ```
   * or
   * ```
   * ctx.addScript([
   *   [
   *     'https://code.jquery.com/jquery.js',
   *     'sha384-KJ3o2DKtIkvYI7KCkRr/rE9...',
   *     'anonymous',
   *   ],
   * ])
   * ```
   * @returns {Void}
   */
  addScript: script => ({
    type: 'ADD_SCRIPT_SOURCES',
    sources: typeof script == 'string' ? [mapScript([script])] : script.map(mapScript)
  }),
  addStyle: style => ({
    type: 'ADD_STYLE',
    style: style.trim()
  }),
  addCss: css => ({
    type: 'ADD_CSS',
    css: typeof css == 'string' ? [mapCss([css])] : css.map(mapCss)
  }),
  addManifest: href => ({
    type: 'ADD_LINKS',
    links: [{
      rel: 'manifest',
      href
    }]
  }),
  addIcon: icon => ({
    type: 'ADD_LINKS',
    links: typeof icon == 'string' ? [mapIcon([icon])] : icon.map(mapIcon)
  }),
  addJs: js => ({
    type: 'ADD_JS',
    js: js.trim()
  }),
  setViewport: viewport => ({
    type: 'SET_VIEWPORT',
    viewport
  })
};
var _default = actions;
exports.default = _default;