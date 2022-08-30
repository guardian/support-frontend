import { css } from '@emotion/react';
import { brand, neutral, space, textSans } from '@guardian/source-foundations';
import type { ReactNode } from 'react';

const tabButtonStyles = css`
	${textSans.medium({ fontWeight: 'bold' })}
	background-color: ${brand[500]};
	color: ${neutral[100]};
	border: none;
	border-bottom: 1px solid ${neutral[86]};
	flex-grow: 1;
	padding-top: 18px;
	padding-bottom: ${space[4]}px;

	:not(:last-of-type) {
		border-right: 1px solid ${neutral[86]};
	}
`;

const tabButtonSelectedStyles = css`
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	border-bottom: none;
`;

export type PaymentFrequencyTabButtonProps = {
	id: string;
	isSelected: boolean;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children: ReactNode;
};

function getButtonStyles(isSelected: boolean) {
	return isSelected
		? [tabButtonStyles, tabButtonSelectedStyles]
		: tabButtonStyles;
}

export function PaymentFrequencyTabButton({
	id,
	isSelected,
	onClick,
	children,
}: PaymentFrequencyTabButtonProps): JSX.Element {
	const selected = isSelected ? 'true' : 'false';
	return (
		<button
			css={getButtonStyles(isSelected)}
			role="tab"
			id={id}
			aria-selected={selected}
			aria-controls={`${id}-tab`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
