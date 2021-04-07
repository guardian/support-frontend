type HtmlProps = {
    html: string;
    title: string;
    key: string;
    ids: string[];
    css: string;
    pageData?: string;
};

const htmlTemplate = ({ html, title, key, ids, css, pageData = '' }: HtmlProps): string => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${title}</title>
        <style data-emotion="${key} ${ids.join(' ')}">${css}</style>
        <script type="text/javascript" src="/assets/javascripts/fontLoader.js"></script>
    </head>
    <body>
        <div id="root">${html}</div>
    </body>
    ${
        pageData &&
        `<script>
        window.__STATE__ = {
            page: ${pageData}
        }
    </script>`
    }
    <iframe id="gu-font-loader-iframe" style="display:none" src="https://www.theguardian.com/font-loader"></iframe>
    </html>
    `;
// <script src="http://localhost:3000/js/client.js" defer></script>

export default htmlTemplate;
