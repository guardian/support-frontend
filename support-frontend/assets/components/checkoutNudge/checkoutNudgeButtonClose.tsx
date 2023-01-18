import { css } from '@emotion/react';
import { Button, SvgCross } from '@guardian/source-react-components';

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

interface CheckoutNudgeCloseButtonProps {
	onClose: () => void;
}

export function CheckoutNudgeCloseButton({
	onClose,
}: CheckoutNudgeCloseButtonProps): JSX.Element {
	return (
		<Button
			onClick={onClose}
			icon={<SvgCross size="xsmall" />}
			size="small"
			hideLabel
			priority="secondary"
			cssOverrides={button}
		/>
	);
}
