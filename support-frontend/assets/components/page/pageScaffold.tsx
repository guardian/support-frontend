import { css, Global } from '@emotion/react';
import { FocusStyleManager } from '@guardian/source-foundations';
import type { ReactNode } from 'react';
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
	id: string;
	header?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
};

FocusStyleManager.onlyShowFocusOnTabs();

export function PageScaffold(props: PageScaffoldProps): JSX.Element {
	useScrollToAnchor();

	return (
		<div id={props.id} css={container}>
			<Global styles={[reset, guardianFonts]} />
			<SkipLink id="maincontent" label="Skip to main content" />
			<SkipLink id="navigation" label="Skip to navigation" />
			<CsrBanner />
			<TestUserBanner />
			{props.header}
			<main role="main" id="maincontent">
				{props.children}
			</main>
			{props.footer}
		</div>
	);
}
