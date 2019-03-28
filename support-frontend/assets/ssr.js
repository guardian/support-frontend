import { content } from 'pages/showcase/showcase';
import ReactDOMServer from 'react-dom/server';


const pages = ['uk/support', 'uk/subscribe/paper'];
const html = ReactDOMServer.renderToString(content);
//console.log(html);
export default function getHtml() {
  return html;
}

export { html }

//
//
// writeFile(
//   resolve(__dirname, '..', 'conf/ssr-cache/', `showcasePage.html`),
//   html, 'utf8', (err) => {
//     if (err) {
//       throw err;
//     }
//     console.log((`done`));
//   },
// );

