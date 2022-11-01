import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import SecurePadlock from './securePadlock.svg';
import SecurePadlockCircle from './securePadlockCircle.svg';

export type SecureTransactionIndicatorProps = {
	position: string;
	hideText?: boolean;
};

const secureTransaction = (position: string) => css`
	display: flex;
	align-items: center;

	${position === 'top' &&
	`
    margin-bottom: 6px;

    ${from.tablet} {
      position: absolute;
      visibility: hidden;
      display: none;
    }
  `}

	${position === 'middle' &&
	`
    margin-top: -${space[3]}px;

    ${until.tablet} {
      position: absolute;
      visibility: hidden;
      display: none;
    }
  `}

	${position === 'center' &&
	`
    justify-content: center;
    align-items: center;
  `}
`;

const suppPlusPayMethodIndicator = css`
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
	position,
	hideText,
}: SecureTransactionIndicatorProps): JSX.Element {
	return (
		<div
			css={hideText ? suppPlusPayMethodIndicator : secureTransaction(position)}
		>
			{hideText ? (
				<SecurePadlockCircle css={padlock} />
			) : (
				<SecurePadlock css={padlock} />
			)}
			{!hideText && <div css={text}>Secure transaction</div>}
		</div>
	);
}
