// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textEgyptianBold15,
} from '@guardian/source/foundations';
import { Link } from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ReactNode } from 'react';
import { paperSubsUrl } from 'helpers/urls/routes';

const linkColor = css`
	color: inherit;
`;

const linkStyles = (
	tab: PaperFulfilmentOptions,
	activeTab?: PaperFulfilmentOptions | null,
) => css`
	color: ${neutral[100]};
	${textEgyptianBold15};
	text-decoration: none;
	padding: ${space[3]}px ${space[3]}px ${space[2]}px;
	border-bottom: ${space[1]}px solid
		${tab === activeTab ? neutral[100] : 'transparent'};
	width: 50%;
	${from.tablet} {
		width: initial;
	}
`;

function LinkTo({
	setTabAction,
	tab,
	children,
	activeTab,
	isPricesTabLink,
}: {
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
	tab: PaperFulfilmentOptions;
	children: ReactNode;
	activeTab?: PaperFulfilmentOptions;
	isPricesTabLink?: boolean;
}): JSX.Element {
	return (
		<Link
			cssOverrides={isPricesTabLink ? linkStyles(tab, activeTab) : linkColor}
			href={paperSubsUrl(activeTab)}
			aria-current={tab === activeTab}
			onClick={(ev) => {
				ev.preventDefault();
				setTabAction(tab);
			}}
		>
			{children}
		</Link>
	);
}

LinkTo.defaultProps = {
	activeTab: null,
	isPricesTabLink: false,
};

export default LinkTo;
