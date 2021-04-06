type HtmlProps = {
    body: string;
    jsPath?: string;
};

const html = ({ body, jsPath }: HtmlProps): string => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div id="app">${body}</div>
    </body>
    ${jsPath ? `<script src="${jsPath}" defer></script>` : ''}
  </html>
`;

export default html;
