import { InlineError } from '@guardian/source-react-components';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { ContributionType } from 'helpers/contributions';
import type {
	AmazonLoginObject,
	AmazonPayData,
	AmazonPaymentsObject,
	BaseWalletConfig,
	ConsentConfig,
} from 'helpers/forms/paymentIntegrations/amazonPay/types';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import type { Action } from 'pages/contributions-landing/contributionsLandingActions';
import {
	setAmazonPayBillingAgreementConsentStatus,
	setAmazonPayBillingAgreementId,
	setAmazonPayOrderReferenceId,
	setAmazonPayPaymentSelected,
	setAmazonPayWalletIsStale,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import './AmazonPay.scss';

type PropTypes = {
	amazonPayData: AmazonPayData;
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
	amazonPayData: state.page.form.amazonPayData,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<State, void, Action>) => ({
	setAmazonPayWalletIsStale: (isReady: boolean) =>
		dispatch(setAmazonPayWalletIsStale(isReady)),
	setAmazonPayOrderReferenceId: (orderReferenceId: string) =>
		dispatch(setAmazonPayOrderReferenceId(orderReferenceId)),
	setAmazonPayPaymentSelected: (paymentSelected: boolean) =>
		dispatch(setAmazonPayPaymentSelected(paymentSelected)),
	setAmazonPayBillingAgreementId: (amazonBillingAgreementId: string) =>
		dispatch(setAmazonPayBillingAgreementId(amazonBillingAgreementId)),
	setAmazonPayBillingAgreementConsentStatus: (
		amazonPayBillingAgreementConsentStatus: boolean,
	) =>
		dispatch(
			setAmazonPayBillingAgreementConsentStatus(
				amazonPayBillingAgreementConsentStatus,
			),
		),
});

const getSellerId = (isTestUser: boolean): string =>
	isTestUser
		? window.guardian.amazonPaySellerId.uat
		: window.guardian.amazonPaySellerId.default;

function AmazonPayWalletComponent(props: PropTypes) {
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
				amazonOrderReferenceId: props.amazonPayData.orderReferenceId,
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
	}, [props.amazonPaymentsObject, props.amazonPayData.walletIsStale]);

	useEffect(() => {
		if (
			props.amazonPaymentsObject &&
			props.amazonPayData.amazonBillingAgreementId &&
			props.contributionType !== 'ONE_OFF'
		) {
			createConsentWidget(
				props.amazonPaymentsObject,
				props.amazonPayData.amazonBillingAgreementId,
			);
		}
	}, [
		props.amazonPaymentsObject,
		props.amazonPayData.amazonBillingAgreementId,
		props.contributionType,
	]);

	if (props.amazonLoginObject && props.amazonPaymentsObject) {
		trackComponentLoad('amazon-pay-wallet-loaded');
		return (
			<div>
				{props.checkoutFormHasBeenSubmitted &&
					!props.amazonPayData.paymentSelected && (
						<InlineError>Please select a payment method</InlineError>
					)}
				<div className="walletWidgetDiv" id="WalletWidgetDiv" />

				{props.contributionType !== 'ONE_OFF' && (
					<div>
						{props.checkoutFormHasBeenSubmitted &&
							!props.amazonPayData.amazonBillingAgreementConsentStatus && (
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

const AmazonPayWallet = connect(
	mapStateToProps,
	mapDispatchToProps,
)(AmazonPayWalletComponent);
export default AmazonPayWallet;
