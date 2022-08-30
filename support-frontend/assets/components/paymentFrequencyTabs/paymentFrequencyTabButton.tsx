import { css } from '@emotion/react';
import {
	brand,
	focusHalo,
	from,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import type { ReactNode } from 'react';

const tabButtonStyles = css`
	${textSans.medium({ fontWeight: 'bold' })}
	background-color: ${brand[500]};
	color: ${neutral[100]};
	margin: 0;
	border: none;
	border-bottom: 1px solid ${neutral[86]};
	flex-grow: 1;
	padding: 13px 0;

	${from.tablet} {
		padding-top: 18px;
		padding-bottom: ${space[4]}px;
	}

	:focus {
		${focusHalo}
		/* Puts the focused button in its own stacking context so the halo shows up correctly */
		position: relative;
	}

	:not(:last-of-type) {
		border-right: 1px solid ${neutral[86]};
	}

	&[aria-selected='true'] {
		background-color: ${neutral[100]};
		color: ${neutral[7]};
		border-bottom: none;
	}
`;

export type PaymentFrequencyTabButtonAttributes = {
	role: 'tab';
	id: string;
	ariaSelected: 'true' | 'false';
	ariaControls: string;
};

export type PaymentFrequencyTabButtonProps =
	PaymentFrequencyTabButtonAttributes & {
		onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
		children: ReactNode;
	};

export function PaymentFrequencyTabButton({
	role,
	id,
	ariaControls,
	ariaSelected,
	onClick,
	children,
}: PaymentFrequencyTabButtonProps): JSX.Element {
	return (
		<button
			css={tabButtonStyles}
			role={role}
			id={id}
			aria-controls={ariaControls}
			aria-selected={ariaSelected}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
