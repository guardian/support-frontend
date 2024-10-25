import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { Global } from '@emotion/react';
import { renderToString } from 'react-dom/server';
import { PrerenderGlobalStyles } from '../assets/helpers/rendering/prerenderGlobalStyles';
import { guardianFonts } from '../assets/stylesheets/emotion/fonts';
import { reset } from '../assets/stylesheets/emotion/reset';

function Loading() {
	return (
		<div>
			<Global styles={[reset, guardianFonts]} />

			<main role="main" id="maincontent">
				<PrerenderGlobalStyles />
				<div>
					<p>Hello world...</p>
				</div>
			</main>
		</div>
	);
}

const html = renderToString(<Loading />);
writeFileSync(
	resolve(__dirname, '../conf/ssr-cache/', `ssr-newspaper-archive-header.html`),
	html,
	'utf8',
);
