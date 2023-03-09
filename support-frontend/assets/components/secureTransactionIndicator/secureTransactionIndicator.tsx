import { css } from '@emotion/react';
import { neutral, textSans } from '@guardian/source-foundations';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';
import SecurePadlock from './securePadlock.svg';
import SecurePadlockCircle from './securePadlockCircle.svg';

export interface SecureTransactionIndicatorProps extends CSSOverridable {
	align?: 'left' | 'right' | 'center';
	theme?: 'dark' | 'light';
	hideText?: boolean;
}

const theming = (theme: 'dark' | 'light') => css`
	color: ${theme === 'dark' ? neutral[46] : neutral[100]};
	opacity: ${theme === 'dark' ? 1 : 0.9};
`;

const secureTransactionWithText = (align: 'left' | 'right' | 'center') => css`
	display: flex;
	align-items: center;
	justify-content: ${align};
`;

const secureTransactionIcon = css`
	display: flex;
	align-items: center;
`;

const padlock = css`
	margin-right: 5px;
	opacity: inherit;
	path {
		fill: currentColor;
	}
`;

const text = css`
	${textSans.xsmall({ fontWeight: 'bold' })};
	letter-spacing: 0.01em;
	opacity: inherit;
`;

export function SecureTransactionIndicator({
	align = 'center',
	theme = 'dark',
	hideText,
	cssOverrides,
}: SecureTransactionIndicatorProps): JSX.Element {
	const mainCss = hideText
		? secureTransactionIcon
		: secureTransactionWithText(align);
	const overrides = cssOverrides ?? css``;
	return (
		<div css={[mainCss, theming(theme), overrides]}>
			{hideText ? (
				<SecurePadlockCircle css={padlock} />
			) : (
				<SecurePadlock css={padlock} />
			)}
			{!hideText && <div css={text}>Secure transaction</div>}
		</div>
	);
}
