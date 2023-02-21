import { css } from '@emotion/react';
import { neutral, textSans } from '@guardian/source-foundations';
import SecurePadlock from './securePadlock.svg';
import SecurePadlockCircle from './securePadlockCircle.svg';

export type SecureTransactionIndicatorProps = {
	hideText?: boolean;
};

const secureTransactionWithText = css`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const secureTransactionIcon = css`
	display: flex;
	align-items: center;
`;

const padlock = css`
	margin-right: 5px;
`;

const text = css`
	${textSans.xsmall({ fontWeight: 'bold' })};
	color: ${neutral[46]};
	letter-spacing: 0.01em;
`;

export function SecureTransactionIndicator({
	hideText,
}: SecureTransactionIndicatorProps): JSX.Element {
	return (
		<div css={hideText ? secureTransactionIcon : secureTransactionWithText}>
			{hideText ? (
				<SecurePadlockCircle css={padlock} />
			) : (
				<SecurePadlock css={padlock} />
			)}
			{!hideText && <div css={text}>Secure transaction</div>}
		</div>
	);
}
