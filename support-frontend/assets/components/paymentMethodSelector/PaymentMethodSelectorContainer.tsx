import type { ContributionType } from 'helpers/contributions';
import { contributionTypeIsRecurring } from 'helpers/contributions';
import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import type {
	ExistingPaymentMethod,
	RecentlySignedInExistingPaymentMethod,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import {
	getFullExistingPaymentMethods,
	isUsableExistingPaymentMethod,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { PaymentMethodSelectorProps } from './paymentMethodSelector';

function existingPaymentMethodsToDisplay(
	contributionType: ContributionType,
	existingPaymentMethods?: ExistingPaymentMethod[],
): RecentlySignedInExistingPaymentMethod[] {
	const shouldShowExistingPaymentMethods =
		contributionTypeIsRecurring(contributionType);

	const existingPaymentMethodList = getFullExistingPaymentMethods(
		existingPaymentMethods,
	);

	return shouldShowExistingPaymentMethods ? existingPaymentMethodList : [];
}

function showReauthenticationLink(
	contributionType: ContributionType,
	existingPaymentMethods?: ExistingPaymentMethod[],
): boolean {
	const shouldShowExistingPaymentMethods =
		contributionTypeIsRecurring(contributionType);
	const hasExistingPaymentMethods = existingPaymentMethods?.length;

	if (!shouldShowExistingPaymentMethods || !hasExistingPaymentMethods) {
		return false;
	}

	return existingPaymentMethods.every(
		(method) => !isUsableExistingPaymentMethod(method),
	);
}

function PaymentMethodSelectorContainer({
	render,
}: {
	render: (
		paymentMethodSelectorProps: PaymentMethodSelectorProps,
	) => JSX.Element;
}): JSX.Element {
	const contributionType = useContributionsSelector(getContributionType);

	const { countryId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const { name, errors } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod,
	);

	const { existingPaymentMethods } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment,
	);
	const { switches } = useContributionsSelector(
		(state) => state.common.settings,
	);

	const availablePaymentMethods = getValidPaymentMethods(
		contributionType,
		switches,
		countryId,
		countryGroupId,
	);

	return render({
		availablePaymentMethods: availablePaymentMethods,
		paymentMethod: name,
		existingPaymentMethod: existingPaymentMethods.selectedPaymentMethod,
		existingPaymentMethodList: existingPaymentMethodsToDisplay(
			contributionType,
			existingPaymentMethods.paymentMethods,
		),
		validationError: errors?.[0],
		pendingExistingPaymentMethods: existingPaymentMethods.status === 'pending',
		showReauthenticateLink: showReauthenticationLink(
			contributionType,
			existingPaymentMethods.paymentMethods,
		),
	});
}

export default PaymentMethodSelectorContainer;
