import { css } from '@emotion/react';
import { headline, until } from '@guardian/source-foundations';
import { useEffect } from 'react';
import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	ExistingCard,
	ExistingDirectDebit,
} from 'helpers/forms/paymentMethods';
import { selectExistingPaymentMethod } from 'helpers/redux/checkout/payment/existingPaymentMethods/actions';
import type { ExistingPaymentMethodsState } from 'helpers/redux/checkout/payment/existingPaymentMethods/state';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { isUserInAbVariant } from 'helpers/redux/commonState/selectors';
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

const optimisedLayoutOverrides = css`
	${until.tablet} {
		h2 {
			${headline.xsmall({ fontWeight: 'bold' })}
		}
	}
`;

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
	const dispatch = useContributionsDispatch();
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

	const useOptimisedMobileLayout = useContributionsSelector(
		isUserInAbVariant('supporterPlusMobileTest1', 'variant'),
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

	function onPaymentMethodEvent(
		event: 'select' | 'render',
		paymentMethod: PaymentMethod,
		existingPaymentMethod?: RecentlySignedInExistingPaymentMethod,
	): void {
		const paymentMethodDescription = existingPaymentMethod
			? existingPaymentMethod.paymentType
			: paymentMethod;

		const trackingId = `payment-method-selector-${paymentMethodDescription}`;

		if (event === 'select') {
			trackComponentClick(trackingId);
			sendEventContributionPaymentMethod(paymentMethodDescription);
			dispatch(setPaymentMethod(paymentMethod));
			existingPaymentMethod &&
				dispatch(selectExistingPaymentMethod(existingPaymentMethod));
		} else {
			trackComponentInsert(trackingId);
		}
	}

	useEffect(() => {
		availablePaymentMethods.length === 1 &&
			dispatch(setPaymentMethod(availablePaymentMethods[0]));
	}, []);

	return render({
		availablePaymentMethods: availablePaymentMethods,
		paymentMethod: name,
		validationError: errors?.[0],
		...getExistingPaymentMethodProps(existingPaymentMethods),
		onPaymentMethodEvent,
		cssOverrides: useOptimisedMobileLayout
			? optimisedLayoutOverrides
			: undefined,
	});
}

export default PaymentMethodSelectorContainer;
