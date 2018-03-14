/**
 * This is the main template wrapper which can add title, links, external
 * scripts, javascript blocks and styles.
 */
const View = ({
  title, children, scripts = [], links = [], styles = [], js = [], viewport,
}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {viewport &&
          <meta name="viewport" content={viewport} />
        }

        <title>{title}</title>

        {links.map((props, i) =>
          <link key={i} {...props} />
        )}
        {styles.map((style, i) =>
          <style key={i} dangerouslySetInnerHTML={{ __html: style }} />
        )}
      </head>
      <body>
        {children}

        {scripts.map((props, i) =>
          <script key={i} {...props} />
        )}
        {js.map((script, i) =>
          <script key={i} dangerouslySetInnerHTML={{ __html: script }} />
        )}
      </body>
    </html>
  )
}

export default View
