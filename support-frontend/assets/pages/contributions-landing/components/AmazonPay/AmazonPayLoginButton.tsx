import { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import Button from 'components/button/button';
import AnimatedDots from 'components/spinners/animatedDots';
import type {
	AmazonLoginObject,
	AmazonPaymentsObject,
} from 'helpers/forms/paymentIntegrations/amazonPay/types';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import { setAmazonPayHasAccessToken } from 'pages/contributions-landing/contributionsLandingActions';
import type { Action } from 'pages/contributions-landing/contributionsLandingActions';

type PropTypes = {
	amazonLoginObject?: AmazonLoginObject;
	amazonPaymentsObject?: AmazonPaymentsObject;
	setAmazonPayHasAccessToken: () => Action;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	setAmazonPayHasAccessToken: () => dispatch(setAmazonPayHasAccessToken),
});

class AmazonPayLoginButtonComponent extends Component<PropTypes> {
	loginPopup = (amazonLoginObject: AmazonLoginObject) => (): void => {
		trackComponentClick('amazon-pay-login-click');
		const loginOptions = {
			scope: 'profile postal_code payments:widget payments:shipping_address',
			popup: true,
		};
		amazonLoginObject.authorize(loginOptions, (response) => {
			if (response.error) {
				logException(`Error from Amazon login: ${response.error}`);
			} else {
				this.props.setAmazonPayHasAccessToken();
			}
		});
	};

	render() {
		if (this.props.amazonLoginObject && this.props.amazonPaymentsObject) {
			trackComponentLoad('amazon-pay-login-loaded');
			return (
				<div>
					<div id="AmazonLoginButton" />
					<Button
						type="button"
						onClick={this.loginPopup(this.props.amazonLoginObject)}
						aria-label="Submit contribution"
					>
						Proceed with Amazon Pay
					</Button>
				</div>
			);
		}

		return <AnimatedDots appearance="dark" />;
	}
}

const AmazonPayLoginButton = connect(
	mapStateToProps,
	mapDispatchToProps,
)(AmazonPayLoginButtonComponent);
export default AmazonPayLoginButton;
