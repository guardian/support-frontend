import { css, Global } from '@emotion/react';
import { FocusStyleManager, resets } from '@guardian/source-foundations';
import type { ReactNode } from 'react';
import CsrBanner from 'components/csr/csrBanner';
import { useScrollToAnchor } from 'helpers/customHooks/useScrollToAnchor';

type PageScaffoldProps = {
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
			<CsrBanner />
			{props.header}
			<main role="main">{props.children}</main>
			{props.footer}
		</div>
	);
}
