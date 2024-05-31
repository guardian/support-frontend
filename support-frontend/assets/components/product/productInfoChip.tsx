import { css } from '@emotion/react';
import { body, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';

type PropTypes = {
	children: ReactNode;
	icon?: ReactNode;
};
const infoChip = css`
	display: flex;
	${body.medium()}

	&:not(:last-of-type) {
		margin-bottom: ${space[4]}px;
	}
`;
const infoChipIcon = css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	vertical-align: text-bottom;
	width: ${space[6]}px;
	height: ${space[6]}px;
	margin-right: ${space[3]}px;

	& > svg {
		/* Repeat height here to fix Safari issue with inline-flex SVGs */
		height: ${space[6]}px;
		display: block;
		fill: currentColor;
	}

	/* Hacky fix for our gift svg */
	& svg.svg-gift {
		height: unset;
	}
`;

function ProductInfoChip({ children, icon }: PropTypes): JSX.Element {
	return (
		<div css={infoChip}>
			{icon && <span css={infoChipIcon}>{icon}</span>}
			{children}
		</div>
	);
}

ProductInfoChip.defaultProps = {
	icon: null,
};
export default ProductInfoChip;
