import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { Button, SvgCross } from '@guardian/source-react-components';

const styles = {
	button: css`
		color: ${neutral[46]};
		background-color: transparent;
		&:hover {
			background-color: transparent;
		}
	`,
};

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
			cssOverrides={styles.button}
		/>
	);
}
