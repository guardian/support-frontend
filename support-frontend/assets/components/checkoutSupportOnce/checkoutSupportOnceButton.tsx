import { css } from '@emotion/react';
import {
	Button,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';

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

interface CheckoutSupportOnceButtonProps {
	onClick: () => void;
}

export function CheckoutSupportOnceButton({
	onClick,
}: CheckoutSupportOnceButtonProps): JSX.Element {
	return (
		<Button
			onClick={onClick}
			icon={<SvgArrowRightStraight size="xsmall" />}
			size="small"
			hideLabel
			priority="secondary"
			cssOverrides={button}
		/>
	);
}
