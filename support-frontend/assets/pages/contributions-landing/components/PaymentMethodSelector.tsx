// ----- Imports ----- //
import { css } from '@emotion/react';
import { Radio, RadioGroup } from '@guardian/source-react-components';
import { connect } from 'react-redux';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import SecureTransactionIndicator from 'components/secureTransactionIndicator/secureTransactionIndicator';
import AnimatedDots from 'components/spinners/animatedDots';
import SvgAmazonPayLogoDs from 'components/svgs/amazonPayLogoDs';
import SvgDirectDebitSymbolDs from 'components/svgs/directDebitSymbolDs';
import SvgNewCreditCardDs from 'components/svgs/newCreditCardDs';
import SvgPayPalDs from 'components/svgs/paypalDs';
import SvgSepa from 'components/svgs/sepa';
import { contributionTypeIsRecurring } from 'helpers/contributions';
import type { ContributionType } from 'helpers/contributions';
import {
	getPaymentLabel,
	getValidPaymentMethods,
} from 'helpers/forms/checkouts';
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
import type { Switches } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getContributionType } from 'helpers/redux/checkout/product/selectors';
import { getReauthenticateUrl } from 'helpers/urls/externalLinks';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import type { Action } from '../contributionsLandingActions';
import {
	loadAmazonPaySdk,
	loadPayPalExpressSdk,
	updatePaymentMethod,
	updateSelectedExistingPaymentMethod,
} from '../contributionsLandingActions';
import type { State } from '../contributionsLandingReducer';
import ContributionChoicesHeader from './ContributionChoicesHeader';

// ----- Component ----- //

interface PaymentMethodSelectorProps {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	currency: IsoCurrency;
	existingPaymentMethods?: ExistingPaymentMethod[];
	paymentMethod: PaymentMethod;
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	updatePaymentMethod: (paymentMethod: PaymentMethod) => void;
	updateSelectedExistingPaymentMethod: (
		existingPaymentMethod?: RecentlySignedInExistingPaymentMethod,
	) => Action;
	isTestUser: boolean;
	switches: Switches;
	payPalHasBegunLoading: boolean;
	amazonPayHasBegunLoading: boolean;
	loadPayPalExpressSdk: (contributionType: ContributionType) => void;
	loadAmazonPaySdk: (
		countryGroupId: CountryGroupId,
		isTestUser: boolean,
	) => void;
	checkoutFormHasBeenSubmitted: boolean;
}

const mapStateToProps = (state: State) => ({
	countryId: state.common.internationalisation.countryId,
	countryGroupId: state.common.internationalisation.countryGroupId,
	currency: state.common.internationalisation.currencyId,
	contributionType: getContributionType(state),
	existingPaymentMethods: state.common.existingPaymentMethods,
	paymentMethod: state.page.form.paymentMethod,
	existingPaymentMethod: state.page.form.existingPaymentMethod,
	isTestUser: state.page.user.isTestUser ?? false,
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

function PaymentMethodSelector(props: PaymentMethodSelectorProps) {
	const paymentMethods: PaymentMethod[] = getValidPaymentMethods(
		props.contributionType,
		props.switches,
		props.countryId,
		props.countryGroupId,
	);

	const fullExistingPaymentMethods = getFullExistingPaymentMethods(
		props.existingPaymentMethods,
	);

	const onPaymentMethodUpdate = (paymentMethod: PaymentMethod) => {
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

	const showErrorMessage =
		props.checkoutFormHasBeenSubmitted && props.paymentMethod === 'None';

	return (
		<div
			className={classNameWithModifiers('form__radio-group', [
				'buttons',
				'contribution-pay',
			])}
		>
			<Legend />

			{paymentMethods.length ? (
				<RadioGroup
					name="payment-method-selector"
					className="form__radio-group-list"
					error={
						showErrorMessage ? 'Please select a payment method' : undefined
					}
				>
					<>
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
											value={existingPaymentMethod.paymentType}
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
											label={
												<PaymentMethodLabel
													label={getExistingPaymentMethodLabel(
														existingPaymentMethod,
													)}
													logo={
														<PaymentMethodLogo
															paymentMethod={mapExistingPaymentMethodToPaymentMethod(
																existingPaymentMethod,
															)}
														/>
													}
													isChecked={
														props.existingPaymentMethod ===
														existingPaymentMethod
													}
												/>
											}
										/>

										<div css={styles.explainerListContainer}>
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
									onPaymentMethodUpdate(paymentMethod);
								}}
								checked={props.paymentMethod === paymentMethod}
								label={
									<PaymentMethodLabel
										label={getPaymentLabel(paymentMethod)}
										logo={<PaymentMethodLogo paymentMethod={paymentMethod} />}
										isChecked={props.paymentMethod === paymentMethod}
									/>
								}
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
					</>
				</RadioGroup>
			) : (
				<GeneralErrorMessage
					classModifiers={['no-valid-payments']}
					errorHeading="Payment methods are unavailable"
					errorReason="all_payment_methods_unavailable"
				/>
			)}
		</div>
	);
}

// ----- Helper components ----- //

function Legend() {
	return (
		<div className="secure-transaction">
			<legend id="payment_method">
				<ContributionChoicesHeader>Payment Method</ContributionChoicesHeader>
			</legend>
			<SecureTransactionIndicator modifierClasses={['middle']} />
		</div>
	);
}

interface PaymentMethodLabelProps {
	label: string;
	logo: JSX.Element;
	isChecked: boolean;
}

function PaymentMethodLabel({
	label,
	logo,
	isChecked,
}: PaymentMethodLabelProps) {
	return (
		<div css={styles.labelContainer} data-checked={isChecked.toString()}>
			<div>{label}</div>
			{logo}
		</div>
	);
}

interface PaymentMethodLogoProps {
	paymentMethod: PaymentMethod;
}

function PaymentMethodLogo({ paymentMethod }: PaymentMethodLogoProps) {
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
}

// ---- Styles ---- //

const styles = {
	labelContainer: css`
		display: flex;
		width: 100%;
		margin: 0;
		justify-content: space-between;
		align-items: center;

		svg {
			width: 36px;
			height: 24px;
			display: block;
		}

		&[data-checked='false'] {
			svg {
				filter: grayscale(100%);
			}
		}
	`,
	explainerListContainer: css`
		font-size: small;
		font-style: italic;
		margin-left: 40px;
		padding-bottom: 6px;
		color: #767676;
		padding-right: 40px;
	`,
};

// ----- Helper functions ----- //

const getFullExistingPaymentMethods = (
	existingPaymentMethods?: ExistingPaymentMethod[],
): RecentlySignedInExistingPaymentMethod[] =>
	(existingPaymentMethods ?? []).filter(isUsableExistingPaymentMethod);

// ----- Exports ----- //

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PaymentMethodSelector);
