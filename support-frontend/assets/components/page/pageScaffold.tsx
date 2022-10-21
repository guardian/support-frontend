import { css, Global } from '@emotion/react';
import { FocusStyleManager, resets } from '@guardian/source-foundations';
import type { ReactNode } from 'react';
import CsrBanner from 'components/csr/csrBanner';
import { SkipLink } from 'components/skipLink/skipLink';
import { TestUserBanner } from 'components/test-user-banner/testUserBanner';
import { useScrollToAnchor } from 'helpers/customHooks/useScrollToAnchor';

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
		<div id={props.id}>
			<Global
				styles={css`
					${resets.resetCSS}
				`}
			/>
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
