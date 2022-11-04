import { contributionTypeIsRecurring } from 'helpers/contributions';
import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import { getFullExistingPaymentMethods } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { PaymentMethodSelectorProps } from './paymentMethodSelector';

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

	const availablePaymentMethods = getValidPaymentMethods(
		contributionType,
		switches,
		countryId,
		countryGroupId,
	);

	return render({
		availablePaymentMethods: availablePaymentMethods,
		paymentMethod: name,
		existingPaymentMethod,
		existingPaymentMethods: existingPaymentMethods ?? [],
		validationError: errors?.[0],
		fullExistingPaymentMethods: getFullExistingPaymentMethods(
			existingPaymentMethods,
		),
		contributionTypeIsRecurring: contributionTypeIsRecurring(contributionType),
	});
}

export default PaymentMethodSelectorContainer;
