import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source-foundations';
import type { ReactNode } from 'react';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

type PropTypes = {
	children: ReactNode;
} & CSSOverridable;

const block = css`
	position: relative;
	margin: ${space[6]}px 0;
	border: 1px solid ${neutral[86]};
	background-color: ${neutral[100]};
	z-index: 2;

	${from.desktop} {
		padding: ${space[12]}px;
	}
`;

function Block(props: PropTypes): JSX.Element {
	return <div css={[block, props.cssOverrides]}>{props.children}</div>;
}

Block.defaultProps = {
	cssOverrides: '',
};
export default Block;
