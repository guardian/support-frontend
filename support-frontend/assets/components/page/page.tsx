// ----- Imports ----- //
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import CsrBanner from 'components/csr/csrBanner';
import { SkipLink } from 'components/skipLink/skipLink';
import { mainContentStyles } from './pageStyles';

type PageProps = {
	id?: string;
	header: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
};

export default function Page(pageProps: PageProps): JSX.Element {
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
	const { id, header, footer, children } = pageProps;
	return (
		<div id={id} className={'gu-content'}>
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
