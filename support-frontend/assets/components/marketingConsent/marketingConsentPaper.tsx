// ----- Imports ----- //

import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	headlineBold20,
	space,
	textSans17,
	textSansItalic15,
} from '@guardian/source/foundations';
import {
	Button,
	buttonThemeBrandAlt,
	SvgEnvelope,
} from '@guardian/source/react-components';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import { checkEmail } from 'helpers/forms/formValidation';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { getEmail } from 'helpers/subscriptionsForms/formFields';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { logException } from 'helpers/utilities/logger';

const subHeading = css`
	margin-bottom: ${space[1]}px;
	${headlineBold20};
	${from.desktop} {
		line-height: normal;
	}
`;
const sansText = css`
	${textSans17};
`;
const tinyText = css`
	${textSansItalic15};
	margin-bottom: ${space[5]}px;
`;
const maxWidth = css`
	${from.tablet} {
		max-width: 70%;
	}

	${from.leftCol} {
		max-width: 60%;
	}
`;
const marginForButton = css`
	margin: ${space[5]}px 0 0;
`;

// ----- Types ----- //

type ButtonPropTypes = {
	confirmOptIn: boolean | null | undefined;
	email: string;
	csrf: CsrfState;
	onClick: (email: string, csrf: CsrfState) => void;
	requestPending: boolean;
};

type PropTypes = ButtonPropTypes & {
	error: boolean;
};

const mapStateToProps = (state: CheckoutState) => ({
	confirmOptIn: state.page.checkoutForm.marketingConsent.confirmOptIn,
	email: getEmail(state),
	csrf: state.page.checkoutForm.csrf,
});

function mapDispatchToProps(dispatch: Dispatch) {
	return {
		onClick: (email: string, csrf: CsrfState) => {
			sendTrackingEventsOnClick({
				id: 'marketing-permissions',
				componentType: 'ACQUISITIONS_OTHER',
			})();
			sendMarketingPreferencesToIdentity(
				true, // it's TRUE because the button says Sign Me Up!
				email,
				dispatch,
				csrf,
			);
		},
	};
}

// ----- Render ----- //
function MarketingButton(props: ButtonPropTypes) {
	const confirmedOrPending =
		props.confirmOptIn === true || props.requestPending;
	const confirmedOptIn = props.confirmOptIn === true;

	if (confirmedOrPending) {
		return (
			<ThemeProvider theme={buttonThemeBrandAlt}>
				<Button
					cssOverrides={marginForButton}
					iconSide="right"
					icon={<SvgEnvelope />}
					disabled
				>
					{confirmedOptIn ? 'Signed up' : 'Pending...'}
				</Button>
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider theme={buttonThemeBrandAlt}>
			<Button
				cssOverrides={marginForButton}
				iconSide="right"
				aria-label="Sign me up to news and offers from the Guardian"
				onClick={() => props.onClick(props.email, props.csrf)}
				icon={<SvgEnvelope />}
			>
				Sign me up
			</Button>
		</ThemeProvider>
	);
}

function MarketingConsent(props: PropTypes) {
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
			<section css={maxWidth}>
				<h3 css={subHeading}>Contributions, subscriptions and membership</h3>
				<p css={sansText}>
					Get related news and offers &ndash; whether you are a contributor,
					subscriber, member or would like to become one.
				</p>

				{MarketingButton({
					confirmOptIn: props.confirmOptIn,
					email: props.email,
					csrf: props.csrf,
					onClick: props.onClick,
					requestPending: props.requestPending,
				})}
				<p css={tinyText}>
					{props.confirmOptIn === true
						? "We'll be in touch. Check your inbox for a confirmation link"
						: 'You can unsubscribe at any time'}
				</p>
				<p css={sansText}>
					This is the option to choose if you want to hear about how to make the
					most of your newspaper subscription, receive a dedicated weekly email
					from our membership editor and get more information on ways to support
					the Guardian.
				</p>
			</section>
		);
	}

	logException(
		'Unable to display marketing consent button due to not having a valid email address to send to the API',
	);
	return null;
}

MarketingConsent.defaultProps = {
	error: false,
	requestPending: false,
}; // ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
