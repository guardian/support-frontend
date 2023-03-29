import { css } from '@emotion/react';
import { SvgChevronRightSingle } from '@guardian/source-react-components';

const button = css`
	color: #606060;
	background-color: transparent;
	&:hover {
		background-color: transparent;
	}
	& svg {
		width: 24px;
		margin: 2px;
	}
`;

export function CheckoutSupportOnceChevronRight(): JSX.Element {
	return (
		<div css={button}>
			<SvgChevronRightSingle size="xsmall" />
		</div>
	);
}
