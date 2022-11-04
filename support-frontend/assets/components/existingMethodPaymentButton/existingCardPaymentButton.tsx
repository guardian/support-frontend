import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { onThirdPartyPaymentAuthorised } from 'pages/contributions-landing/contributionsLandingActions';

export function ExistingCardPaymentButton(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { existingPaymentMethod } = useContributionsSelector(
		(state) => state.page.form,
	);

	const payWithExistingCard = useFormValidation(function pay() {
		void dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: 'ExistingCard',
				billingAccountId: existingPaymentMethod?.billingAccountId ?? '',
			}),
		);
	});

	return <DefaultPaymentButtonContainer onClick={payWithExistingCard} />;
}
