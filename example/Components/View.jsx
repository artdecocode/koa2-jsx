/**
 * This is the main template wrapper which can add JavaScript text and files,
 * and has Bootstrap installed from a CDN. It has a reference to CSS and a font.
 */
const View = ({ title, children, scripts = [], scriptSources = [], links = [] }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />

        {/* <link rel='shortcut icon' href='/public/favicon.ico' /> */}
        <link rel="stylesheet" href="/css/index.css" />
        {links.map((props, i) =>
          <link key={i} {...props} />
        )}
      </head>
      <body>
        {children}

        {scriptSources.map((props, i) =>
          <script key={i} {...props} />
        )}
        {scripts.map((script, i) =>
          <script key={i} dangerouslySetInnerHTML={{ __html: script }} />
        )}
      </body>
    </html>
  )
}

export default View
