import { css } from '@emotion/react';
import { neutral, textSans } from '@guardian/source-foundations';
import { getSignoutUrl } from 'helpers/urls/externalLinks';

const signOutStyles = css`
	${textSans.xsmall({ fontWeight: 'light' })}
	color: ${neutral[7]};
`;

interface SignoutProps {
	isSignedIn: boolean;
	returnUrl?: string;
}

function Signout({ isSignedIn, returnUrl }: SignoutProps): JSX.Element | null {
	if (!isSignedIn) {
		return null;
	}

	return (
		<a css={signOutStyles} href={getSignoutUrl(returnUrl)}>
			Not you? Sign out
		</a>
	);
}

export default Signout;
