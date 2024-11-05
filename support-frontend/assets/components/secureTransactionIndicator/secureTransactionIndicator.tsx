import { css } from '@emotion/react';
import { neutral, textSansBold14 } from '@guardian/source/foundations';
import { SecurePadlock } from 'components/svgs/securePadlock';
import { SecurePadlockCircle } from 'components/svgs/securePadlockCircle';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

export interface SecureTransactionIndicatorProps extends CSSOverridable {
	align?: 'left' | 'right' | 'center';
	theme?: 'dark' | 'light';
	hideText?: boolean;
}

const darkColour = neutral[46];
const lightColour = neutral[100];
const darkColourOpacity = 1;
const lightColourOpacity = 0.9;
const theming = (theme: 'dark' | 'light') => css`
	color: ${theme === 'dark' ? darkColour : lightColour};
	opacity: ${theme === 'dark' ? darkColourOpacity : lightColourOpacity};
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
	svg {
		display: block;
		opacity: inherit;
	}
`;

const text = css`
	${textSansBold14};
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
	return (
		<div css={[mainCss, theming(theme), cssOverrides]}>
			<div css={padlock}>
				{hideText ? (
					<SecurePadlockCircle
						colour={theme === 'dark' ? darkColour : lightColour}
						opacity={theme === 'dark' ? darkColourOpacity : lightColourOpacity}
					/>
				) : (
					<SecurePadlock
						colour={theme === 'dark' ? darkColour : lightColour}
						opacity={theme === 'dark' ? darkColourOpacity : lightColourOpacity}
					/>
				)}
			</div>
			{!hideText && <div css={text}>Secure transaction</div>}
		</div>
	);
}
