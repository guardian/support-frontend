import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { onThirdPartyPaymentAuthorised } from 'pages/contributions-landing/contributionsLandingActions';

export function ExistingDirectDebitPaymentButton(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { existingPaymentMethod } = useContributionsSelector(
		(state) => state.page.form,
	);

	const payWithExistingDD = useFormValidation(function pay() {
		void dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: 'ExistingDirectDebit',
				billingAccountId: existingPaymentMethod?.billingAccountId ?? '',
			}),
		);
	});

	return <DefaultPaymentButtonContainer onClick={payWithExistingDD} />;
}
