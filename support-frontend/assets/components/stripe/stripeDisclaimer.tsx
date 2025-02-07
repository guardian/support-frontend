import { css } from '@emotion/react';
import { palette, space, textSans14 } from '@guardian/source/foundations';

export const DisclaimerOnSubscribeStyles = css`
	margin-top: ${space[3]}px;
	${textSans14};
	a {
		color: ${palette.neutral[0]};
	}
`;

export function StripeDisclaimer() {
	return (
		<>
			All card payments are powered by Stripe. Read the Stripe{' '}
			<a href="https://stripe.com/privacy" target="_blank">
				privacy policy
			</a>{' '}
			and{' '}
			<a href="https://stripe.com/legal/end-users" target="_blank">
				terms and conditions
			</a>
			.
		</>
	);
}
