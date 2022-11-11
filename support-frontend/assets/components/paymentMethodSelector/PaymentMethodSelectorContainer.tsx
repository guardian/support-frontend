import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
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
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import { detect as detectCountry } from 'helpers/internationalisation/country';
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

	const { existingPaymentMethod } = useContributionsSelector(
		(state) => state.page.form,
	);
	const { existingPaymentMethods } = useContributionsSelector(
		(state) => state.common,
	);
	const { switches } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const participations: Participations = initAbTests(
		detectCountry(),
		countryGroupId,
		getSettings(),
	);
	const isSupporterPlus = participations.supporterPlus === 'variant';

	const availablePaymentMethods = getValidPaymentMethods(
		contributionType,
		switches,
		countryId,
		countryGroupId,
		isSupporterPlus,
	);

	// We check on page init if we should try to retrieve existing payment methods from MDAPI
	// If we are in the process of retrieving them but the request is still pending, the value will be undefined.
	// If we know we're not retrieving them the value is immediately set to an empty array
	// TODO: Do this in a less weird way with a proper thunk and pending state!
	const pendingExistingPaymentMethods = existingPaymentMethods === undefined;

	return render({
		availablePaymentMethods: availablePaymentMethods,
		paymentMethod: name,
		existingPaymentMethod,
		existingPaymentMethodList: existingPaymentMethodsToDisplay(
			contributionType,
			existingPaymentMethods,
		),
		validationError: errors?.[0],
		pendingExistingPaymentMethods,
		showReauthenticateLink: showReauthenticationLink(
			contributionType,
			existingPaymentMethods,
		),
	});
}

export default PaymentMethodSelectorContainer;
