import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	getMaximumContributionAmount,
	getMinimumContributionAmount,
} from 'helpers/redux/commonState/selectors';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

function amountIsNotInRange(amount: string, min: number, max: number) {
	const amountAsFloat = Number.parseFloat(amount);

	return amountAsFloat > max || amountAsFloat < min;
}

export function getOtherAmountErrors(
	state: ContributionsState,
): string[] | undefined {
	const constributionType = getContributionType(state);
	const { errors, otherAmounts, selectedAmounts } =
		state.page.checkoutForm.product;

	if (selectedAmounts[constributionType] !== 'other') {
		return [];
	}

	if (errors.otherAmount?.length) {
		return errors.otherAmount;
	}

	// If the amount is not a numeric string this will have been caught by the schema validation
	// but the type is still potentially null
	const customAmount = otherAmounts[constributionType].amount ?? '';
	const minAmount = getMinimumContributionAmount(state);
	const maxAmount = getMaximumContributionAmount(state);

	if (amountIsNotInRange(customAmount, minAmount, maxAmount)) {
		return [`Please provide an amount between ${minAmount} and ${maxAmount}`];
	}
}
