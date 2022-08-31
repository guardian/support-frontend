import { css } from '@emotion/react';
import { focus } from '@guardian/source-foundations';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

const tabPanelStyles = css`
	/* .src-focus-disabled is added by the Source FocusStyleManager */
	html:not(.src-focus-disabled) &:focus {
		outline: 5px solid ${focus[400]};
		outline-offset: -5px;
	}
`;

type PaymentFrequencyTabPanelProps = {
	id: string;
	ariaLabelledby: string;
	isSelected: boolean;
	children: ReactNode;
};

export function PaymentFrequencyTabPanel({
	id,
	ariaLabelledby,
	isSelected,
	children,
}: PaymentFrequencyTabPanelProps): JSX.Element {
	const isInitialMount = useRef(true);
	const tabPanel = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			tabPanel.current?.focus();
		}
	}, [isSelected]);

	return (
		<div
			ref={tabPanel}
			css={tabPanelStyles}
			role="tabpanel"
			id={id}
			aria-labelledby={ariaLabelledby}
			hidden={!isSelected}
			tabIndex={0}
		>
			{children}
		</div>
	);
}
