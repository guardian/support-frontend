import { Global } from '@emotion/react';
import { PrerenderGlobalStyles } from 'helpers/rendering/prerenderGlobalStyles';
import { guardianFonts } from 'stylesheets/emotion/fonts';
import { reset } from 'stylesheets/emotion/reset';

export function NewspaperArchiveHeader() {
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
