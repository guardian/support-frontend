// @ts-expect-error - required for hooks
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import type { Action } from 'pages/contributions-landing/contributionsLandingActions';
import {
	setAmazonPayBillingAgreementConsentStatus,
	setAmazonPayBillingAgreementId,
	setAmazonPayOrderReferenceId,
	setAmazonPayPaymentSelected,
	setAmazonPayWalletIsStale,
} from 'pages/contributions-landing/contributionsLandingActions';
import type {
	AmazonPayData,
	State,
} from 'pages/contributions-landing/contributionsLandingReducer';
import './AmazonPay.scss';
import { logException } from 'helpers/utilities/logger';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import type { ContributionType } from 'helpers/contributions';
import { InlineError } from '@guardian/src-user-feedback';

type PropTypes = {
	amazonPayData: AmazonPayData;
	setAmazonPayWalletIsStale: (arg0: boolean) => Action;
	setAmazonPayOrderReferenceId: (arg0: string) => Action;
	setAmazonPayPaymentSelected: (arg0: boolean) => Action;
	setAmazonPayBillingAgreementId: (arg0: string) => Action;
	setAmazonPayBillingAgreementConsentStatus: (arg0: boolean) => Action;
	isTestUser: boolean;
	contributionType: ContributionType;
	checkoutFormHasBeenSubmitted: boolean;
};

const mapStateToProps = (state: State) => ({
	amazonPayData: state.page.form.amazonPayData,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
});

const mapDispatchToProps = (dispatch: (...args: any[]) => any) => ({
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

const AmazonPayWalletComponent = (props: PropTypes) => {
	const createWalletWidget = (
		amazonPaymentsObject: Record<string, any>,
	): void => {
		props.setAmazonPayPaymentSelected(false); // in case we've previously created a wallet

		const baseWalletConfig = {
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
		amazonPaymentsObject: Record<string, any>,
		amazonBillingAgreementId: string,
	): void => {
		const consentConfig = {
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
		const { amazonPaymentsObject } = props.amazonPayData.amazonPayLibrary;

		if (amazonPaymentsObject) {
			createWalletWidget(amazonPaymentsObject);
		}
	}, [
		props.amazonPayData.amazonPayLibrary.amazonPaymentsObject,
		props.amazonPayData.walletIsStale,
	]);
	useEffect(() => {
		const { amazonPaymentsObject } = props.amazonPayData.amazonPayLibrary;

		if (
			amazonPaymentsObject &&
			props.amazonPayData.amazonBillingAgreementId &&
			props.contributionType !== 'ONE_OFF'
		) {
			createConsentWidget(
				amazonPaymentsObject,
				props.amazonPayData.amazonBillingAgreementId,
			);
		}
	}, [
		props.amazonPayData.amazonPayLibrary.amazonPaymentsObject,
		props.amazonPayData.amazonBillingAgreementId,
		props.contributionType,
	]);
	const { amazonLoginObject, amazonPaymentsObject } =
		props.amazonPayData.amazonPayLibrary;

	if (amazonLoginObject && amazonPaymentsObject) {
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
};

const AmazonPayWallet = connect(
	mapStateToProps,
	mapDispatchToProps,
)(AmazonPayWalletComponent);
export default AmazonPayWallet;
