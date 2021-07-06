// ----- Imports ----- //
import { Node } from 'react';
import React from 'react';
import { css } from '@emotion/core';
import { Link } from '@guardian/src-link';
import { paperSubsUrl } from 'helpers/urls/routes';
import { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
const linkColor = css`
	color: inherit;
`;

function LinkTo({
	setTabAction,
	tab,
	children,
}: {
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
	tab: PaperFulfilmentOptions;
	children: Node;
}) {
	return (
		<Link
			css={linkColor}
			href={paperSubsUrl(tab === 'delivery')}
			onClick={(ev) => {
				ev.preventDefault();
				setTabAction(tab);
			}}
		>
			{children}
		</Link>
	);
}

export default LinkTo;
