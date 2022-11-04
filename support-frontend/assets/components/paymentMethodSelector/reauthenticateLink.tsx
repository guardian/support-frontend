import { css } from '@emotion/react';
import { space, textSans } from '@guardian/source-foundations';
import { getReauthenticateUrl } from 'helpers/urls/externalLinks';

const reauthenticateLinkStyles = css`
	${textSans.small()};
	padding: ${space[3]}px;
`;

export function ReauthenticateLink(): JSX.Element {
	return (
		<p css={reauthenticateLinkStyles}>
			...or{' '}
			<a className="reauthenticate-link" href={getReauthenticateUrl()}>
				re-enter your password
			</a>{' '}
			to use one of your existing payment methods.
		</p>
	);
}
