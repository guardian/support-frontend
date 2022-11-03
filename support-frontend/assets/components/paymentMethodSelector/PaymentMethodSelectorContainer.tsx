import { contributionTypeIsRecurring } from 'helpers/contributions';
import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import { getFullExistingPaymentMethods } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { isContribution } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { PaymentMethodSelectorProps } from './paymentMethodSelector';

function PaymentMethodSelectorContainer({
	render,
}: {
	render: (
		paymentMethodSelectorProps: PaymentMethodSelectorProps,
	) => JSX.Element;
}): JSX.Element {
	const contributionType = useContributionsSelector(
		(state) => state.page.checkoutForm.product.productType,
	);

	const { countryId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod.name,
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

	const availablePaymentMethods: PaymentMethod[] | false =
		isContribution(contributionType) &&
		getValidPaymentMethods(
			contributionType,
			switches,
			countryId,
			countryGroupId,
		);

	return render({
		availablePaymentMethods: availablePaymentMethods || [],
		paymentMethod,
		existingPaymentMethod,
		existingPaymentMethods: existingPaymentMethods ?? [],
		validationError: undefined,
		fullExistingPaymentMethods: getFullExistingPaymentMethods(
			existingPaymentMethods,
		),
		contributionTypeIsRecurring:
			isContribution(contributionType) &&
			contributionTypeIsRecurring(contributionType),
	});
}

export default PaymentMethodSelectorContainer;
