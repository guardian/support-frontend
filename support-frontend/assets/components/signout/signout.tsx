import { getSignoutUrl } from 'helpers/urls/externalLinks';

interface SignoutProps {
	isSignedIn: boolean;
	returnUrl?: string;
}

function Signout({ isSignedIn, returnUrl }: SignoutProps): JSX.Element | null {
	if (!isSignedIn) {
		return null;
	}

	return (
		<a className="component-signout" href={getSignoutUrl(returnUrl)}>
			Not you? Sign out
		</a>
	);
}

export default Signout;
