// ----- Imports ----- //
import { Global } from '@emotion/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import CsrBanner from 'components/csr/csrBanner';
import { pageDefaultStyles } from 'components/page/styles/pageDefaults';
import { SkipLink } from 'components/skipLink/skipLink';
import { guardianFonts } from 'stylesheets/emotion/fonts';
import { reset } from 'stylesheets/emotion/reset';
import { mainContentStyles, pageContainer } from './pageStyles';

type PageProps = {
	id?: string;
	header: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
};

export default function Page({
	id,
	header,
	footer,
	children,
}: PageProps): JSX.Element {
	useEffect(() => {
		requestAnimationFrame(() => {
			if (window.location.hash) {
				const hashElement = document.getElementById(
					window.location.hash.substr(1),
				);

				if (hashElement) {
					hashElement.scrollIntoView();
				}
			}
		});
	}, []);
	return (
		<div id={id} css={[pageContainer, pageDefaultStyles]}>
			<Global styles={[reset, guardianFonts]} />
			<SkipLink id="maincontent" label="Skip to main content" />
			<CsrBanner />
			{header}
			<main role={'main'} id={'maincontent'} css={mainContentStyles}>
				{children}
			</main>
			{footer}
		</div>
	);
}
