// ----- Imports ----- //
import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';

export const orderedListItem = css`
	position: relative;
	list-style: none;
	counter-increment: step-counter;
	padding-left: ${space[5]}px;
	margin-bottom: ${space[3]}px;
	&:before {
		position: absolute;
		top: 0;
		left: 0;
		font-weight: 700;
		content: counter(step-counter) '.';
	}
`;
// ---- Types ----- //
type PropTypes = {
	items: ReactNode[];
};

// ----- Render ----- //
function OrderedList({ items }: PropTypes): JSX.Element {
	return (
		<ol>
			{items.map((item) => (
				<li css={orderedListItem}>{item}</li>
			))}
		</ol>
	);
}

export default OrderedList;
