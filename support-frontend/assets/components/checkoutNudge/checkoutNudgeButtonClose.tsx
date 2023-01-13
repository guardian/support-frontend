import { css } from '@emotion/react';
import { Button, SvgCross } from '@guardian/source-react-components';

const styles = {
	button: css`
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
