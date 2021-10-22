// ----- Imports ----- //
import { TextInput } from '@guardian/src-text-input';
import React from 'react';
import { connect } from 'react-redux';
import type {
	ContributionAmounts,
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { config } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import { amountIsValid } from 'helpers/forms/formValidation';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { LocalCurrencyCountry } from 'helpers/internationalisation/localCurrencyCountry';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import {
	selectAmount,
	updateOtherAmount,
} from '../contributionsLandingActions';
import type { State } from '../contributionsLandingReducer';
import '../contributionsLandingReducer';
import ContributionAmountChoices from './ContributionAmountChoices';
// ----- Types ----- //
type PropTypes = {
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	contributionType: ContributionType;
	amounts: ContributionAmounts;
	selectedAmounts: SelectedAmounts;
	selectAmount: (
		arg0: number | 'other',
		arg1: CountryGroupId,
		arg2: ContributionType,
	) => () => void;
	otherAmounts: OtherAmounts;
	updateOtherAmount: (
		arg0: string,
		arg1: CountryGroupId,
		arg2: ContributionType,
	) => void;
	checkoutFormHasBeenSubmitted: boolean;
	stripePaymentRequestButtonClicked: boolean;
	localCurrencyCountry: LocalCurrencyCountry | null | undefined;
	useLocalCurrency: boolean;
};

const mapStateToProps = (state: State) => ({
	countryGroupId: state.common.internationalisation.countryGroupId,
	currency: state.common.internationalisation.currencyId,
	contributionType: state.page.form.contributionType,
	amounts: state.common.amounts,
	selectedAmounts: state.page.form.selectedAmounts,
	otherAmounts: state.page.form.formData.otherAmounts,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
	stripePaymentRequestButtonClicked:
		state.page.form.stripePaymentRequestButtonData.ONE_OFF
			.stripePaymentRequestButtonClicked ||
		state.page.form.stripePaymentRequestButtonData.REGULAR
			.stripePaymentRequestButtonClicked,
	localCurrencyCountry: state.common.internationalisation.localCurrencyCountry,
	useLocalCurrency: state.common.internationalisation.useLocalCurrency,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- temp solution
const mapDispatchToProps = (dispatch: (...args: any[]) => any) => ({
	selectAmount:
		(
			amount: number | 'other',
			countryGroupId: CountryGroupId,
			contributionType: ContributionType,
		) =>
		() => {
			trackComponentClick(
				`npf-contribution-amount-toggle-${countryGroupId}-${contributionType}-${amount}`,
			);
			dispatch(selectAmount(amount, contributionType));
		},
	updateOtherAmount: (
		amount: string,
		countryGroupId: CountryGroupId,
		contributionType: ContributionType,
	) => {
		dispatch(updateOtherAmount(amount, contributionType));
	},
});

function ContributionAmount(props: PropTypes) {
	const { amounts: validAmounts, defaultAmount } =
		props.amounts[props.contributionType];
	const showOther: boolean =
		props.selectedAmounts[props.contributionType] === 'other';
	const { min, max } =
		props.useLocalCurrency && props.localCurrencyCountry
			? props.localCurrencyCountry.config[props.contributionType]
			: config[props.countryGroupId][props.contributionType];
	const minAmount: string = formatAmount(
		currencies[props.currency],
		spokenCurrencies[props.currency],
		min,
		false,
	);
	const maxAmount: string = formatAmount(
		currencies[props.currency],
		spokenCurrencies[props.currency],
		max,
		false,
	);
	const otherAmount = props.otherAmounts[props.contributionType].amount;
	const otherLabelSymbol: string = currencies[props.currency].glyph;
	const { checkoutFormHasBeenSubmitted, stripePaymentRequestButtonClicked } =
		props;
	const canShowOtherAmountErrorMessage =
		checkoutFormHasBeenSubmitted ||
		stripePaymentRequestButtonClicked ||
		!!otherAmount;
	const otherAmountErrorMessage: string =
		canShowOtherAmountErrorMessage &&
		!amountIsValid(
			otherAmount ?? '',
			props.countryGroupId,
			props.contributionType,
			props.localCurrencyCountry,
			props.useLocalCurrency,
		)
			? `Please provide an amount between ${minAmount} and ${maxAmount}`
			: '';
	return (
		<fieldset
			className={classNameWithModifiers('form__radio-group', [
				'pills',
				'contribution-amount',
			])}
		>
			<legend
				className={classNameWithModifiers('form__legend', ['radio-group'])}
			>
				How much would you like to give?
			</legend>

			<ContributionAmountChoices
				countryGroupId={props.countryGroupId}
				currency={props.currency}
				contributionType={props.contributionType}
				validAmounts={validAmounts}
				defaultAmount={defaultAmount}
				showOther={showOther}
				selectedAmounts={props.selectedAmounts}
				selectAmount={props.selectAmount}
				shouldShowFrequencyButtons={props.contributionType !== 'ONE_OFF'}
			/>

			{showOther && (
				<div
					className={classNameWithModifiers('form__field', [
						'contribution-other-amount',
					])}
				>
					<TextInput
						id="contributionOther"
						label={`Other amount`}
						value={`${otherLabelSymbol}${otherAmount ?? ''}`}
						onChange={(e) =>
							props.updateOtherAmount(
								e.target.value.replace(/[^0-9]/g, ''),
								props.countryGroupId,
								props.contributionType,
							)
						}
						onBlur={() =>
							!!otherAmount &&
							trackComponentClick(
								`npf-contribution-amount-toggle-${props.countryGroupId}-${props.contributionType}-${otherAmount}`,
							)
						}
						error={otherAmountErrorMessage}
						autoComplete="off"
						autoFocus
						inputMode="numeric"
						pattern="[0-9]*"
					/>
				</div>
			)}
		</fieldset>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributionAmount);
