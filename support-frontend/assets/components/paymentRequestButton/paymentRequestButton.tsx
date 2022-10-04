import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { Divider } from '@guardian/source-react-components-development-kitchen';

const containerStyles = css`
	width: 100%;
	padding-top: ${space[6]}px;
	padding-bottom: ${space[5]}px;
`;

const buttonContainer = css`
	margin-bottom: 28px;
`;

const dividerOverrides = css`
	::before {
		margin-left: 0;
	}

	::after {
		margin-right: 0;
	}

	margin: 0;
	width: 100%;
`;

export type PaymentRequestButtonProps = {
	button?: React.ReactNode;
};

export function PaymentRequestButton({
	button,
}: PaymentRequestButtonProps): JSX.Element {
	const dividerText = button ? 'or' : '';

	return (
		<div css={containerStyles}>
			{button && <div css={buttonContainer}>{button}</div>}
			<Divider
				displayText={dividerText}
				size="full"
				cssOverrides={dividerOverrides}
			/>
		</div>
	);
}
