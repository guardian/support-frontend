import { InlineError } from '@guardian/source-react-components';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import type { ContributionType } from 'helpers/contributions';
import type {
	AmazonLoginObject,
	AmazonPaymentsObject,
	BaseWalletConfig,
	ConsentConfig,
} from 'helpers/forms/paymentIntegrations/amazonPay/types';
import {
	setAmazonPayBillingAgreementConsentStatus,
	setAmazonPayBillingAgreementId,
	setAmazonPayOrderReferenceId,
	setAmazonPayPaymentSelected,
	setAmazonPayWalletIsStale,
} from 'helpers/redux/checkout/payment/amazonPay/actions';
import type { AmazonPayState } from 'helpers/redux/checkout/payment/amazonPay/state';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import './amazonPayForm.scss';

type PropTypes = {
	amazonPay: AmazonPayState;
	amazonLoginObject?: AmazonLoginObject;
	amazonPaymentsObject?: AmazonPaymentsObject;
	setAmazonPayWalletIsStale: (isStale: boolean) => void;
	setAmazonPayOrderReferenceId: (referenceId: string) => void;
	setAmazonPayPaymentSelected: (paymentSelected: boolean) => void;
	setAmazonPayBillingAgreementId: (agreementId: string) => void;
	setAmazonPayBillingAgreementConsentStatus: (consentStatus: boolean) => void;
	isTestUser: boolean;
	contributionType: ContributionType;
	checkoutFormHasBeenSubmitted: boolean;
};

const mapStateToProps = (state: State) => ({
	amazonPay: state.page.checkoutForm.payment.amazonPay,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
});

const mapDispatchToProps = {
	setAmazonPayWalletIsStale,
	setAmazonPayOrderReferenceId,
	setAmazonPayPaymentSelected,
	setAmazonPayBillingAgreementId,
	setAmazonPayBillingAgreementConsentStatus,
};

const getSellerId = (isTestUser: boolean): string =>
	isTestUser
		? window.guardian.amazonPaySellerId.uat
		: window.guardian.amazonPaySellerId.default;

function AmazonPayWalletComponent(props: PropTypes) {
	console.log('amazonPayForm.AmazonPayWalletComponent.props', props);
	const createWalletWidget = (
		amazonPaymentsObject: AmazonPaymentsObject,
	): void => {
		props.setAmazonPayPaymentSelected(false); // in case we've previously created a wallet

		const baseWalletConfig: BaseWalletConfig = {
			sellerId: getSellerId(props.isTestUser),
			design: {
				designMode: 'responsive',
			},
			onPaymentSelect: () => {
				props.setAmazonPayPaymentSelected(true);
			},
			onError: (error) => {
				// The widget UI will display an error to the user, so we can just log it
				logException(`Amazon Pay wallet error: ${error.getErrorMessage()}`);
			},
		};

		if (props.contributionType !== 'ONE_OFF') {
			new amazonPaymentsObject.Widgets.Wallet({
				...baseWalletConfig,
				onReady: (billingAgreement) => {
					props.setAmazonPayBillingAgreementId(
						billingAgreement.getAmazonBillingAgreementId(),
					);
				},
				agreementType: 'BillingAgreement',
			}).bind('WalletWidgetDiv');
		} else {
			new amazonPaymentsObject.Widgets.Wallet({
				...baseWalletConfig,
				amazonOrderReferenceId: props.amazonPay.orderReferenceId,
				onOrderReferenceCreate: (orderReference) => {
					props.setAmazonPayOrderReferenceId(
						orderReference.getAmazonOrderReferenceId(),
					);
				},
				agreementType: 'orderReference',
			}).bind('WalletWidgetDiv');
		}

		props.setAmazonPayWalletIsStale(false);
	};

	const createConsentWidget = (
		amazonPaymentsObject: AmazonPaymentsObject,
		amazonBillingAgreementId: string,
	): void => {
		const consentConfig: ConsentConfig = {
			amazonBillingAgreementId,
			sellerId: getSellerId(props.isTestUser),
			design: {
				designMode: 'responsive',
			},
			onReady: (billingAgreementConsentStatus) => {
				const amazonBillingAgreementConsentStatus =
					billingAgreementConsentStatus.getConsentStatus() === 'true';
				props.setAmazonPayBillingAgreementConsentStatus(
					amazonBillingAgreementConsentStatus,
				);
			},
			onConsent: (billingAgreementConsentStatus) => {
				const amazonBillingAgreementConsentStatus =
					billingAgreementConsentStatus.getConsentStatus() === 'true';
				props.setAmazonPayBillingAgreementConsentStatus(
					amazonBillingAgreementConsentStatus,
				);
			},
			onError: (error) => {
				logException(`Amazon Pay consent error: ${error.getErrorMessage()}`);
			},
		};

		new amazonPaymentsObject.Widgets.Consent(consentConfig).bind(
			'ConsentWidgetDiv',
		);
	};

	useEffect(() => {
		if (props.amazonPaymentsObject) {
			createWalletWidget(props.amazonPaymentsObject);
		}
	}, [props.amazonPaymentsObject, props.amazonPay.walletIsStale]);

	useEffect(() => {
		if (
			props.amazonPaymentsObject &&
			props.amazonPay.amazonBillingAgreementId &&
			props.contributionType !== 'ONE_OFF'
		) {
			createConsentWidget(
				props.amazonPaymentsObject,
				props.amazonPay.amazonBillingAgreementId,
			);
		}
	}, [
		props.amazonPaymentsObject,
		props.amazonPay.amazonBillingAgreementId,
		props.contributionType,
	]);

	if (props.amazonLoginObject && props.amazonPaymentsObject) {
		trackComponentLoad('amazon-pay-wallet-loaded');
		return (
			<div>
				{props.checkoutFormHasBeenSubmitted &&
					!props.amazonPay.paymentSelected && (
						<InlineError>Please select a payment method</InlineError>
					)}
				<div className="walletWidgetDiv" id="WalletWidgetDiv" />

				{props.contributionType !== 'ONE_OFF' && (
					<div>
						{props.checkoutFormHasBeenSubmitted &&
							!props.amazonPay.amazonBillingAgreementConsentStatus && (
								<InlineError>
									Please tick the box to agree to a recurring payment
								</InlineError>
							)}
						<div className="consentWidgetDiv" id="ConsentWidgetDiv" />
					</div>
				)}
			</div>
		);
	}

	return null;
}

const AmazonPayForm = connect(
	mapStateToProps,
	mapDispatchToProps,
)(AmazonPayWalletComponent);
export default AmazonPayForm;
