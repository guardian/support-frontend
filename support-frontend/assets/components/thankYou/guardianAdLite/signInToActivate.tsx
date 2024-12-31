import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { LinkButton } from '@guardian/source/react-components';

const btnStyleOverrides = css`
	justify-content: left;
	margin-bottom: ${space[5]}px;
`;

export type SignInToActivateCTAProp = {
	returnAddress: string;
};

export function SignInToActivate(): JSX.Element {
	return (
		<p>
			To be able to read the Guardian with non-personalised advertising you must
			be signed in on all your devices.
		</p>
	);
}

export function SignInToActivateCTA({
	returnAddress,
}: SignInToActivateCTAProp): JSX.Element {
	return (
		<LinkButton
			cssOverrides={btnStyleOverrides}
			href={returnAddress}
			size="default"
			aria-label="Sign in and activate your subscription"
		>
			Sign in and activate your subscription
		</LinkButton>
	);
}
