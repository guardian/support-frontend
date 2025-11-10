import { css, Global } from '@emotion/react';
import { FocusStyleManager, palette } from '@guardian/source/foundations';
import { type ReactNode, useEffect } from 'react';
import CsrBanner from 'components/csr/csrBanner';
import { SkipLink } from 'components/skipLink/skipLink';
import { TestUserBanner } from 'components/test-user-banner/testUserBanner';
import { useScrollToAnchor } from 'helpers/customHooks/useScrollToAnchor';
import { guardianFonts } from 'stylesheets/emotion/fonts';
import { reset } from 'stylesheets/emotion/reset';

const container = css`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	max-width: 100%;
	overflow-x: hidden;
	background-color: ${palette.brand[400]};

	& main {
		flex: 1;
		display: flex;
		flex-direction: column;
		& > :last-child {
			flex: 1;
		}
	}
`;

export type PageScaffoldProps = {
	header?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
};

export function PageScaffold({
	header,
	footer,
	children,
}: PageScaffoldProps): JSX.Element {
	useScrollToAnchor();

	useEffect(() => {
		FocusStyleManager.onlyShowFocusOnTabs();
	}, []);

	return (
		<div css={container}>
			<Global styles={[reset, guardianFonts]} />
			<nav aria-label="Skip to section">
				<SkipLink id="maincontent" label="Skip to main content" />
				<SkipLink id="navigation" label="Skip to navigation" />
			</nav>
			<CsrBanner />
			<TestUserBanner />
			{header}
			<main role="main" id="maincontent">
				{children}
			</main>
			{footer}
		</div>
	);
}
