// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	space,
	textSans17,
	textSansBold17,
} from '@guardian/source/foundations';
import type { ReactNode } from 'react';

const expander = css`
	summary::-webkit-details-marker {
		display: none;
	}
`;
const summary = css`
	display: block;
	cursor: pointer;
	margin: ${space[1]}px 0;
`;
const copyStyleLabel = css`
	${textSansBold17};
	text-decoration: underline;
`;
const copyStyle = css`
	${textSans17};
`;

// ----- Types ----- //
type ExpanderPropTypes = {
	copy: string;
	children: ReactNode;
};

// ----- Component ----- //
function CheckoutExpander({ copy, children }: ExpanderPropTypes): JSX.Element {
	return (
		<details css={expander}>
			<summary css={summary}>
				<strong css={copyStyleLabel}>{copy}</strong>
			</summary>
			<div css={copyStyle}>{children}</div>
		</details>
	);
}

// ----- Exports ----- //
export default CheckoutExpander;
