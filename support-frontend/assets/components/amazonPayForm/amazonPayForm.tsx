import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { InlineError } from '@guardian/source-react-components';
import { useEffect } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type {
	AmazonLoginObject,
	AmazonPaymentsObject,
	BaseWalletConfig,
	ConsentConfig,
} from 'helpers/forms/paymentIntegrations/amazonPay/types';
import type { AmazonPayState } from 'helpers/redux/checkout/payment/amazonPay/state';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';

const walletWidget = css`
	margin: 0 auto ${space[5]}px;
	width: 100%;
	height: 228px;
`;
const consentWidget = css`
	margin: 0 auto ${space[5]}px;
	width: 100%;
	height: 120px;
`;

type PropTypes = {
	amazonPay: AmazonPayState;
	amazonLoginObject?: AmazonLoginObject;
	amazonPaymentsObject?: AmazonPaymentsObject;
	onAmazonPayWalletIsStale: (isStale: boolean) => void;
	onAmazonPayOrderReferenceId: (referenceId: string) => void;
	onAmazonPayPaymentSelected: (paymentSelected: boolean) => void;
	onAmazonPayBillingAgreementId: (agreementId: string) => void;
	onAmazonPayBillingAgreementConsentStatus: (consentStatus: boolean) => void;
	isTestUser: boolean;
	contributionType: ContributionType;
	checkoutFormHasBeenSubmitted: boolean;
	errors: AmazonPayState['errors'];
};

const getSellerId = (isTestUser: boolean): string =>
	isTestUser
		? window.guardian.amazonPaySellerId.uat
		: window.guardian.amazonPaySellerId.default;

function AmazonPayForm(props: PropTypes): JSX.Element | null {
	const createWalletWidget = (
		amazonPaymentsObject: AmazonPaymentsObject,
	): void => {
		props.onAmazonPayPaymentSelected(false); // in case we've previously created a wallet

		const baseWalletConfig: BaseWalletConfig = {
			sellerId: getSellerId(props.isTestUser),
			design: {
				designMode: 'responsive',
			},
			onPaymentSelect: () => {
				props.onAmazonPayPaymentSelected(true);
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
					props.onAmazonPayBillingAgreementId(
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
					props.onAmazonPayOrderReferenceId(
						orderReference.getAmazonOrderReferenceId(),
					);
				},
				agreementType: 'orderReference',
			}).bind('WalletWidgetDiv');
		}

		props.onAmazonPayWalletIsStale(false);
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
				props.onAmazonPayBillingAgreementConsentStatus(
					amazonBillingAgreementConsentStatus,
				);
			},
			onConsent: (billingAgreementConsentStatus) => {
				const amazonBillingAgreementConsentStatus =
					billingAgreementConsentStatus.getConsentStatus() === 'true';
				props.onAmazonPayBillingAgreementConsentStatus(
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
				{props.errors.paymentSelected && (
					<InlineError id="paymentSelected">
						Please select a payment method
					</InlineError>
				)}
				<div css={walletWidget} id="WalletWidgetDiv" />

				{props.contributionType !== 'ONE_OFF' && (
					<div>
						{props.errors.consentStatus && (
							<InlineError id="consentStatus">
								Please tick the box to agree to a recurring payment
							</InlineError>
						)}
						<div css={consentWidget} id="ConsentWidgetDiv" />
					</div>
				)}
			</div>
		);
	}

	return null;
}

export default AmazonPayForm;
