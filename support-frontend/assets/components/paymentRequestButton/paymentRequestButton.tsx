import { css } from '@emotion/react';
import { Divider } from '@guardian/source-react-components-development-kitchen';

const buttonContainerStyles = css`
	width: 100%;
`;

const dividerOverrides = css`
	::before {
		margin-left: 0;
	}

	::after {
		margin-right: 0;
	}
`;

export type PaymentRequestButtonProps = {
	button?: React.ReactNode;
};

export function PaymentRequestButton({
	button,
}: PaymentRequestButtonProps): JSX.Element {
	const dividerText = button ? 'or' : '';
	return (
		<div css={buttonContainerStyles}>
			{button}
			<Divider
				displayText={dividerText}
				size="full"
				cssOverrides={dividerOverrides}
			/>
		</div>
	);
}
