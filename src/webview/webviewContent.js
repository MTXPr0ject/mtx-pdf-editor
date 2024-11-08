export function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PDF Editor</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/main.js"></script>
      </body>
    </html>
  `;
}