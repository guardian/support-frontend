// ----- Imports ----- //
import { css } from '@emotion/react';
import { Button } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { headline, textSans } from '@guardian/src-foundations/typography';
import React from 'react';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { checkEmail } from 'helpers/forms/formValidation';
import { logException } from 'helpers/utilities/logger';
import 'components/marketingConsent/marketingConsent.scss';

const minorHeading = css`
	${headline.xxsmall({
		fontWeight: 'bold',
	})};
	margin-bottom: ${space[3]}px;
`;

const sansText = css`
	${textSans.medium()};
`;

const marginTopAndBottom = css`
	margin: ${space[3]}px 0 ${space[1]}px;
`;

const unsubscribeText = css`
	${textSans.small()};
	font-style: italic;
	margin-bottom: ${space[4]}px;
`;

// ----- Types ----- //
type PropTypes = {
	confirmOptIn: boolean | null | undefined;
	email: string;
	csrf: CsrfState;
	onClick: (email: string, csrf: CsrfState) => void;
	error: boolean;
};

// ----- Render ----- //
function MarketingConsentGift(props: PropTypes): JSX.Element | null {
	if (props.error) {
		return (
			<GeneralErrorMessage
				classModifiers={['marketing_consent_api_error']}
				errorHeading="Sorry, something went wrong"
				errorReason="marketing_consent_api_error"
			/>
		);
	}

	if (checkEmail(props.email)) {
		return (
			<span>
				<h3 css={minorHeading}>Contributions, subscriptions and membership</h3>
				<p css={sansText}>
					Get related news and offers – whether you are a contributor,
					subscriber, member or would like to become one
				</p>
				<div css={marginTopAndBottom}>
					<Button
						priority="secondary"
						aria-label="Sign me up to news and offers from the Guardian"
						onClick={() => props.onClick(props.email, props.csrf)}
					>
						Sign me up
					</Button>
				</div>
				<p css={unsubscribeText}>
					<small>
						{props.confirmOptIn === true ? (
							"We'll be in touch. Check your inbox for a confirmation link."
						) : (
							<div>
								<span>You can unsubscribe at any time</span>
							</div>
						)}
					</small>
				</p>
			</span>
		);
	}

	logException(
		'Unable to display marketing consent button due to not having a valid email address to send to the API',
	);
	return null;
}

MarketingConsentGift.defaultProps = {
	error: false,
}; // ----- Exports ----- //

export default MarketingConsentGift;
