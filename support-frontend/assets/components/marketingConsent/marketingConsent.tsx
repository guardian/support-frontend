// ----- Imports ----- //
import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import Button from 'components/button/button';
import NonInteractiveButton from 'components/button/nonInteractiveButton';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import SvgSubscribe from 'components/svgs/subscribe';
import SvgSubscribed from 'components/svgs/subscribed';
import 'components/marketingConsent/marketingConsent.scss';
import Text from 'components/text/text';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { checkEmail } from 'helpers/forms/formValidation';
import { logException } from 'helpers/utilities/logger';
// ----- Types ----- //
type ButtonPropTypes = {
	confirmOptIn?: boolean;
	email: string;
	csrf: CsrfState;
	onClick: (arg0?: string, arg1: CsrfState) => void;
	requestPending: boolean;
};
type PropTypes = ButtonPropTypes & {
	error: boolean;
};

// ----- Render ----- //
function MarketingButton(props: ButtonPropTypes) {
	if (props.confirmOptIn === true) {
		return (
			<NonInteractiveButton
				appearance="greenHollow"
				iconSide="right"
				icon={<SvgSubscribed />}
			>
				Signed up
			</NonInteractiveButton>
		);
	} else if (props.requestPending) {
		return (
			<NonInteractiveButton
				appearance="greyHollow"
				iconSide="right"
				icon={<SvgSubscribe />}
			>
				Pending...
			</NonInteractiveButton>
		);
	}

	return (
		<Button
			appearance="green"
			iconSide="right"
			aria-label="Sign me up to news and offers from the Guardian"
			onClick={() => props.onClick(props.email, props.csrf)}
			icon={<SvgSubscribe />}
		>
			Sign me up
		</Button>
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
			<section
				className={classNameWithModifiers('component-marketing-consent', [
					'newsletter',
				])}
			>
				<Text title="Supporting the Guardian">
					Stay up-to-date with the latest offers and the aims of the
					organisation, as well as ways you can enjoy and support our
					independent journalism.
				</Text>

				{MarketingButton({
					confirmOptIn: props.confirmOptIn,
					email: props.email,
					csrf: props.csrf,
					onClick: props.onClick,
					requestPending: props.requestPending,
				})}

				<p className="component-marketing-consent-confirmation">
					<small>
						{props.confirmOptIn === true ? (
							"We'll be in touch. Check your inbox for a confirmation link."
						) : (
							<div>
								<span className="component-marketing-consent-confirmation__message">
									You can unsubscribe at any time
								</span>
							</div>
						)}
					</small>
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

export default MarketingConsent;
