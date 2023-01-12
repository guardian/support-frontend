import { css } from '@emotion/react';
import * as React from 'react';

const expandableContainer = css`
  overflow: hidden;
  transition: max-height 0.1s ease-in-out;
 }
`;
const expandableContainerCollapsed = css`
	${expandableContainer}
	max-height: 0px;
`;

const expandableContainerExpanded = (maxHeight: number) => css`
	${expandableContainer}
	max-height: ${maxHeight}px;
`;

type ExpandableContainerProps = {
	isExpanded: boolean;
	maxHeight: number;
	children: React.ReactNode;
};

function ExpandableContainer({
	isExpanded,
	maxHeight,
	children,
}: ExpandableContainerProps) {
	return (
		<div
			css={
				isExpanded
					? expandableContainerExpanded(maxHeight)
					: expandableContainerCollapsed
			}
		>
			{children}
		</div>
	);
}

export default ExpandableContainer;
