import { useEffect } from 'react';
import type { ContributionType } from 'helpers/contributions';
import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import {
	trackComponentClick,
	trackComponentInsert,
} from 'helpers/tracking/behaviour';
import { sendEventContributionPaymentMethod } from 'helpers/tracking/quantumMetric';
import type { PaymentMethodSelectorProps } from './paymentMethodSelector';

type PaymentMethodSelectorContainerProps = {
	render: (
		paymentMethodSelectorProps: PaymentMethodSelectorProps,
	) => JSX.Element;
	contributionTypeOverride?: ContributionType;
};

function PaymentMethodSelectorContainer({
	render,
	contributionTypeOverride,
}: PaymentMethodSelectorContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const contributionType =
		contributionTypeOverride ?? useContributionsSelector(getContributionType);

	const { countryId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const { name, errors } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod,
	);

	const availablePaymentMethods = getValidPaymentMethods(
		contributionType,
		countryId,
		countryGroupId,
	);

	function onPaymentMethodEvent(
		event: 'select' | 'render',
		paymentMethod: PaymentMethod,
	): void {
		const trackingId = `payment-method-selector-${paymentMethod}`;

		if (event === 'select') {
			trackComponentClick(trackingId);
			sendEventContributionPaymentMethod(paymentMethod);
			dispatch(setPaymentMethod({ paymentMethod }));
		} else {
			trackComponentInsert(trackingId);
		}
	}

	useEffect(() => {
		availablePaymentMethods.length === 1 &&
			dispatch(setPaymentMethod({ paymentMethod: availablePaymentMethods[0] }));
	}, []);

	return render({
		availablePaymentMethods: availablePaymentMethods,
		paymentMethod: name,
		validationError: errors?.[0],
		onPaymentMethodEvent,
	});
}

export default PaymentMethodSelectorContainer;
