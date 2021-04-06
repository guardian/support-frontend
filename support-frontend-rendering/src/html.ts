type HtmlProps = {
    html: string;
    title: string;
    key: string;
    ids: string[];
    css: string;
    pageData: string;
};

const htmlTemplate = ({ html, title, key, ids, css, pageData }: HtmlProps): string => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        <link rel="preload" href="https://assets.guim.co.uk/static/frontend/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Medium.woff2" as="font" crossorigin>
        <link rel="preload" href="https://assets.guim.co.uk/static/frontend/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-MediumItalic.woff2" as="font" crossorigin>
        <link rel="preload" href="https://assets.guim.co.uk/static/frontend/fonts/guardian-headline/noalts-not-hinted/GHGuardianHeadline-Bold.woff2" as="font" crossorigin>
        <link rel="preload" href="https://assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2" as="font" crossorigin>
        <link rel="preload" href="https://assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff2" as="font" crossorigin>
        <link rel="preload" href="https://assets.guim.co.uk/static/frontend/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Regular.woff2" as="font" crossorigin>
        <link rel="preload" href="https://assets.guim.co.uk/static/frontend/fonts/guardian-textsans/noalts-not-hinted/GuardianTextSans-Bold.woff2" as="font" crossorigin>
        <title>${title}</title>
        <style data-emotion="${key} ${ids.join(' ')}">${css}</style>
    </head>
    <body>
        <div id="root">${html}</div>
    </body>
    <script>
        window.__STATE__ = {
            page: ${pageData}
        }
    </script>
    <script src="http://localhost:3000/js/client.js" defer></script>
  </html>
`;

export default htmlTemplate;
