import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { Divider } from '@guardian/source-react-components-development-kitchen';

const containerStyles = css`
	width: 100%;
	padding-top: ${space[6]}px;
	padding-bottom: ${space[5]}px;
`;

const buttonContainer = (shouldShowButton: boolean) => css`
	margin-bottom: ${shouldShowButton ? 28 : 0}px;
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
	shouldShowButton: boolean;
	children: React.ReactNode;
};

export function PaymentRequestButton({
	shouldShowButton,
	children,
}: PaymentRequestButtonProps): JSX.Element {
	const dividerText = shouldShowButton ? 'or' : '';

	return (
		<div css={containerStyles}>
			<div css={buttonContainer(shouldShowButton)}>{children}</div>
			<Divider
				displayText={dividerText}
				size="full"
				cssOverrides={dividerOverrides}
			/>
		</div>
	);
}
