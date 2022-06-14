// ----- Imports ----- //
import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { TextInput } from '@guardian/source-react-components';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import { config } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import { amountIsValid } from 'helpers/forms/formValidation';
import 'helpers/internationalisation/countryGroup';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import {
	setOtherAmount,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import type { State } from '../contributionsLandingReducer';
import ContributionAmountChoices from './ContributionAmountChoices';

const otherAmoutInputCss = css`
	padding-left: ${space[5]}px;
`;

const otherAmoutGlphCss = css`
	position: absolute;
	font-weight: bold;
	bottom: 22px; // half of the fixed height of the input element we get from source
	transform: translateY(50%);
	padding-left: ${space[2]}px;
`;

const mapStateToProps = (state: State) => ({
	countryGroupId: state.common.internationalisation.countryGroupId,
	currency: state.common.internationalisation.currencyId,
	contributionType: getContributionType(state.page.checkoutForm.product),
	amounts: state.common.amounts,
	selectedAmounts: state.page.checkoutForm.product.selectedAmounts,
	otherAmounts: state.page.checkoutForm.product.otherAmounts,
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

const mapDispatchToProps = {
	setSelectedAmount,
	setOtherAmount,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector>;

function ContributionAmount(props: PropTypes) {
	const { amounts: validAmounts, defaultAmount } =
		props.amounts[props.contributionType];
	const showOther: boolean =
		props.selectedAmounts[props.contributionType] === 'other';
	const { min, max } =
		props.useLocalCurrency &&
		props.localCurrencyCountry &&
		props.contributionType === 'ONE_OFF'
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
	const otherAmountGlyph: string = currencies[props.currency].glyph;
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
				currency={props.currency}
				contributionType={props.contributionType}
				validAmounts={validAmounts}
				defaultAmount={defaultAmount}
				showOther={showOther}
				selectedAmounts={props.selectedAmounts}
				selectAmount={props.setSelectedAmount}
				shouldShowFrequencyButtons={props.contributionType !== 'ONE_OFF'}
			/>

			{showOther && (
				<div
					className={classNameWithModifiers('form__field', [
						'contribution-other-amount',
					])}
				>
					<p css={otherAmoutGlphCss}>{otherAmountGlyph}</p>
					<TextInput
						id="contributionOther"
						cssOverrides={otherAmoutInputCss}
						label={`Other amount`}
						value={`${otherAmount ?? ''}`}
						onChange={(e) =>
							props.setOtherAmount({
								amount: e.target.value.replace(/[^0-9]/g, ''),
								contributionType: props.contributionType,
							})
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

export default connector(ContributionAmount);
