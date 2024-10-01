import { css } from '@emotion/react';
import { neutral, textSans14 } from '@guardian/source/foundations';
import { getSignoutUrl } from 'helpers/urls/externalLinks';

const signOutStyles = css`
	${textSans14};
	font-weight: lighter;
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
