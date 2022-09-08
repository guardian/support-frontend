// ----- Imports ----- //
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import { config } from 'helpers/contributions';
import 'helpers/internationalisation/countryGroup';
import {
	setOtherAmount,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { sendEventContributionCartValue } from 'helpers/tracking/quantumMetric';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import ContributionAmountChoices from './ContributionAmountChoices';
import { ContributionAmountOtherAmountField } from './ContributionAmountOtherAmountField';

const mapStateToProps = (state: ContributionsState) => ({
	countryGroupId: state.common.internationalisation.countryGroupId,
	currency: state.common.internationalisation.currencyId,
	contributionType: getContributionType(state),
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
	const otherAmount = props.otherAmounts[props.contributionType].amount;
	const canShowOtherAmountErrorMessage =
		props.checkoutFormHasBeenSubmitted ||
		props.stripePaymentRequestButtonClicked ||
		!!otherAmount;

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
				<ContributionAmountOtherAmountField
					countryGroupId={props.countryGroupId}
					amount={props.otherAmounts[props.contributionType].amount ?? ''}
					contributionType={props.contributionType}
					canShowErrorMessage={canShowOtherAmountErrorMessage}
					currency={props.currency}
					max={max}
					min={min}
					onChange={(amount) => {
						props.setOtherAmount({
							amount,
							contributionType: props.contributionType,
						});
					}}
					onBlur={() => {
						if (otherAmount) {
							trackComponentClick(
								`npf-contribution-amount-toggle-${props.countryGroupId}-${props.contributionType}-${otherAmount}`,
							);

							sendEventContributionCartValue(
								otherAmount,
								props.contributionType,
								props.currency,
							);
						}
					}}
					localCurrencyCountry={props.localCurrencyCountry}
					useLocalCurrency={props.useLocalCurrency}
				/>
			)}
		</fieldset>
	);
}

export default connector(ContributionAmount);
