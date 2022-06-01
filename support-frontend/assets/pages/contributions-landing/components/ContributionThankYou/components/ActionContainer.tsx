import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source-foundations';
import * as React from 'react';

const container = css`
	background: white;
	padding-top: ${space[2]}px;
	padding-bottom: ${space[5]}px;

	${from.tablet} {
		padding-left: ${space[4]}px;
		padding-right: 72px;
		border: 1px solid ${neutral[86]};
	}

	display: grid;
	grid-column-gap: ${space[3]}px;
	grid-template-columns: min-content 1fr;
	grid-template-areas:
		'icon header'
		'body body';

	${from.tablet} {
		grid-template-areas:
			'icon header'
			'---- body';
	}
`;
const iconContainer = css`
	grid-area: icon;

	svg {
		display: block;
	}
`;
const headerContainer = css`
	grid-area: header;

	display: flex;
	align-items: center;
`;
const bodyContainer = css`
	grid-area: body;
`;
type ActionContainerProps = {
	icon: React.ReactNode;
	header: React.ReactNode;
	body: React.ReactNode;
};

function ActionContainer({
	icon,
	header,
	body,
}: ActionContainerProps): JSX.Element {
	return (
		<section css={container}>
			<div css={iconContainer}>{icon}</div>
			<div css={headerContainer}>{header}</div>
			<div css={bodyContainer}>{body}</div>
		</section>
	);
}

export default ActionContainer;
