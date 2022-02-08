// ----- Imports ----- //
import { css } from '@emotion/react';
import React from 'react';
import { connect } from 'react-redux';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import SecureTransactionIndicator from 'components/secureTransactionIndicator/secureTransactionIndicator';
import AnimatedDots from 'components/spinners/animatedDots';
import SvgAmazonPayLogoDs from 'components/svgs/amazonPayLogoDs';
import SvgDirectDebitSymbolDs from 'components/svgs/directDebitSymbolDs';
import SvgNewCreditCardDs from 'components/svgs/newCreditCardDs';
import SvgPayPalDs from 'components/svgs/paypalDs';
import { contributionTypeIsRecurring } from 'helpers/contributions';
import {
	getPaymentLabel,
	getValidPaymentMethods,
} from 'helpers/forms/checkouts';
import type { Switches } from 'helpers/globalsAndSwitches/settings';
import 'helpers/globalsAndSwitches/settings';
import type { ContributionType } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import 'helpers/internationalisation/currency';
import type { State } from '../contributionsLandingReducer';
import '../contributionsLandingReducer';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import type { Action } from '../contributionsLandingActions';
import {
	loadAmazonPaySdk,
	loadPayPalExpressSdk,
	updatePaymentMethod,
	updateSelectedExistingPaymentMethod,
} from '../contributionsLandingActions';
import {
	getExistingPaymentMethodLabel,
	isUsableExistingPaymentMethod,
	mapExistingPaymentMethodToPaymentMethod,
	subscriptionsToExplainerList,
	subscriptionToExplainerPart,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type {
	ExistingPaymentMethod,
	RecentlySignedInExistingPaymentMethod,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getReauthenticateUrl } from 'helpers/urls/externalLinks';
import { Radio, RadioGroup } from '@guardian/src-radio';
import SvgSepa from 'components/svgs/sepa';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import ContributionChoicesHeader from './ContributionChoicesHeader';
// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	currency: IsoCurrency;
	existingPaymentMethods: ExistingPaymentMethod[] | typeof undefined;
	paymentMethod: PaymentMethod;
	existingPaymentMethod: RecentlySignedInExistingPaymentMethod;
	updatePaymentMethod: (
		arg0: PaymentMethod,
	) => (arg0: (...args: any[]) => any) => void;
	updateSelectedExistingPaymentMethod: (
		arg0: RecentlySignedInExistingPaymentMethod | typeof undefined,
	) => Action;
	isTestUser: boolean;
	switches: Switches;
	payPalHasBegunLoading: boolean;
	amazonPayHasBegunLoading: boolean;
	loadPayPalExpressSdk: (
		contributionType: ContributionType,
	) => (dispatch: (...args: any[]) => any) => void;
	loadAmazonPaySdk: (
		countryGroupId: CountryGroupId,
		isTestUser: boolean,
	) => (dispatch: (...args: any[]) => any) => void;
	checkoutFormHasBeenSubmitted: boolean;
};

/* eslint-enable react/no-unused-prop-types */
const mapStateToProps = (state: State) => ({
	countryId: state.common.internationalisation.countryId,
	countryGroupId: state.common.internationalisation.countryGroupId,
	currency: state.common.internationalisation.currencyId,
	contributionType: state.page.form.contributionType,
	existingPaymentMethods: state.common.existingPaymentMethods,
	paymentMethod: state.page.form.paymentMethod,
	existingPaymentMethod: state.page.form.existingPaymentMethod,
	isTestUser: state.page.user.isTestUser || false,
	switches: state.common.settings.switches,
	payPalHasBegunLoading: state.page.form.payPalData.hasBegunLoading,
	amazonPayHasBegunLoading: state.page.form.amazonPayData.hasBegunLoading,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
});

const mapDispatchToProps = {
	updatePaymentMethod,
	updateSelectedExistingPaymentMethod,
	loadPayPalExpressSdk,
	loadAmazonPaySdk,
};

// ----- Render ----- //
const getPaymentMethodLogo = (paymentMethod: PaymentMethod) => {
	switch (paymentMethod) {
		case PayPal:
			return <SvgPayPalDs />;

		case DirectDebit:
		case ExistingDirectDebit:
			return <SvgDirectDebitSymbolDs />;

		case AmazonPay:
			return <SvgAmazonPayLogoDs />;

		case Sepa:
			return <SvgSepa />;

		case Stripe:
		case ExistingCard:
		default:
			return <SvgNewCreditCardDs />;
	}
};

const legend = (
	<div className="secure-transaction">
		<legend id="payment_method">
			<ContributionChoicesHeader>Payment Method</ContributionChoicesHeader>
		</legend>
		<SecureTransactionIndicator modifierClasses={['middle']} />
	</div>
);

const renderLabelAndLogo = (paymentMethod: PaymentMethod) => (
	<>
		<div>{getPaymentLabel(paymentMethod)}</div>
		{getPaymentMethodLogo(paymentMethod)}
	</>
);

const renderExistingLabelAndLogo = (
	existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
) => (
	<>
		<div>{getExistingPaymentMethodLabel(existingPaymentMethod)}</div>
		{getPaymentMethodLogo(
			mapExistingPaymentMethodToPaymentMethod(existingPaymentMethod),
		)}
	</>
);

// having to do this nasty cast because Flow sucks and type guards don't work through .filter
const getFullExistingPaymentMethods = (
	props: PropTypes,
): RecentlySignedInExistingPaymentMethod[] =>
	(props.existingPaymentMethods || []).filter(
		isUsableExistingPaymentMethod,
	) as any;

const noPaymentMethodsErrorMessage = (
	<GeneralErrorMessage
		classModifiers={['no-valid-payments']}
		errorHeading="Payment methods are unavailable"
		errorReason="all_payment_methods_unavailable"
	/>
);
const radioCss = {
	'& + div': {
		display: 'flex',
		width: '100%',
		margin: 0,
		justifyContent: 'space-between',
	},
	'& + div svg': {
		width: '36px',
		height: '24px',
	},
	'&:not(:checked) + div svg': {
		filter: 'grayscale(100%)',
	},
};

const onPaymentMethodUpdate = (
	paymentMethod: PaymentMethod,
	props: PropTypes,
) => {
	switch (paymentMethod) {
		case PayPal:
			if (!props.payPalHasBegunLoading) {
				props.loadPayPalExpressSdk(props.contributionType);
			}

			break;

		case AmazonPay:
			if (!props.amazonPayHasBegunLoading) {
				props.loadAmazonPaySdk(props.countryGroupId, props.isTestUser);
			}

			break;

		default:
	}

	props.updatePaymentMethod(paymentMethod);
	props.updateSelectedExistingPaymentMethod(undefined);
};

function PaymentMethodSelector(props: PropTypes) {
	const paymentMethods: PaymentMethod[] = getValidPaymentMethods(
		props.contributionType,
		props.switches,
		props.countryId,
		props.countryGroupId,
	);
	const fullExistingPaymentMethods = getFullExistingPaymentMethods(props);
	const showErrorMessage =
		props.checkoutFormHasBeenSubmitted && props.paymentMethod === 'None';
	return (
		<div
			className={classNameWithModifiers('form__radio-group', [
				'buttons',
				'contribution-pay',
			])}
		>
			{legend}
			{paymentMethods.length ? (
				<RadioGroup
					className="form__radio-group-list"
					error={showErrorMessage && 'Please select a payment method'}
				>
					{contributionTypeIsRecurring(props.contributionType) &&
						!props.existingPaymentMethods && (
							<div className="awaiting-existing-payment-options">
								<AnimatedDots appearance="medium" />
							</div>
						)}
					{contributionTypeIsRecurring(props.contributionType) &&
						fullExistingPaymentMethods.map(
							(
								existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
							) => (
								<>
									<Radio
										id={`paymentMethodSelector-existing${existingPaymentMethod.billingAccountId}`}
										name="paymentMethodSelector"
										type="radio"
										value={existingPaymentMethod}
										onChange={() => {
											props.updatePaymentMethod(
												mapExistingPaymentMethodToPaymentMethod(
													existingPaymentMethod,
												),
											);
											props.updateSelectedExistingPaymentMethod(
												existingPaymentMethod,
											);
										}}
										checked={
											props.paymentMethod ===
												mapExistingPaymentMethodToPaymentMethod(
													existingPaymentMethod,
												) &&
											props.existingPaymentMethod === existingPaymentMethod
										}
										arial-labelledby="payment_method"
										label={renderExistingLabelAndLogo(existingPaymentMethod)}
										cssOverrides={radioCss}
									/>
									<div
										css={css`
											font-size: small;
											font-style: italic;
											margin-left: 40px;
											padding-bottom: 6px;
											color: #767676;
											padding-right: 40px;
										`}
									>
										Used for your{' '}
										{subscriptionsToExplainerList(
											existingPaymentMethod.subscriptions.map(
												subscriptionToExplainerPart,
											),
										)}
									</div>
								</>
							),
						)}
					{paymentMethods.map((paymentMethod) => (
						<Radio
							id={`paymentMethodSelector-${paymentMethod}`}
							name="paymentMethodSelector"
							type="radio"
							value={paymentMethod}
							onChange={() => {
								onPaymentMethodUpdate(paymentMethod, props);
							}}
							checked={props.paymentMethod === paymentMethod}
							label={renderLabelAndLogo(paymentMethod)}
							cssOverrides={radioCss}
						/>
					))}
					{contributionTypeIsRecurring(props.contributionType) &&
						props.existingPaymentMethods &&
						props.existingPaymentMethods.length > 0 &&
						fullExistingPaymentMethods.length === 0 && (
							<li className="form__radio-group-item">
								...or{' '}
								<a
									className="reauthenticate-link"
									href={getReauthenticateUrl()}
								>
									re-enter your password
								</a>{' '}
								to use one of your existing payment methods.
							</li>
						)}
				</RadioGroup>
			) : (
				noPaymentMethodsErrorMessage
			)}
		</div>
	);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PaymentMethodSelector);
