import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import {
	ExistingCard,
	ExistingDirectDebit,
} from 'helpers/forms/paymentMethods';
import type { ExistingPaymentMethodsState } from 'helpers/redux/checkout/payment/existingPaymentMethods/state';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { PaymentMethodSelectorProps } from './paymentMethodSelector';

function getExistingPaymentMethodProps(
	existingPaymentMethods: ExistingPaymentMethodsState,
) {
	if (existingPaymentMethods.showExistingPaymentMethods) {
		const showReauthenticateLink =
			existingPaymentMethods.showReauthenticateLink;

		const existingPaymentMethodList = existingPaymentMethods.paymentMethods;

		return {
			existingPaymentMethod: existingPaymentMethods.selectedPaymentMethod,
			existingPaymentMethodList,
			pendingExistingPaymentMethods:
				existingPaymentMethods.status === 'pending',
			showReauthenticateLink,
		};
	}
	return {
		existingPaymentMethodList: [],
		pendingExistingPaymentMethods: existingPaymentMethods.status === 'pending',
		showReauthenticateLink: false,
	};
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
	).filter(
		(methodName) =>
			methodName !== ExistingCard && methodName !== ExistingDirectDebit,
	);

	return render({
		availablePaymentMethods: availablePaymentMethods,
		paymentMethod: name,
		validationError: errors?.[0],
		...getExistingPaymentMethodProps(existingPaymentMethods),
	});
}

export default PaymentMethodSelectorContainer;
