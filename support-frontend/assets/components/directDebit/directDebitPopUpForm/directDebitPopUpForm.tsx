// ----- Imports ----- //
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import SvgCross from 'components/svgs/cross';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import './directDebitPopUpForm.scss';
import {
	resetFormError,
	setPopupClose,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';

type PropTypes = {
	onPaymentAuthorisation: (authorisation: PaymentAuthorisation) => void;
};

// ----- Component ----- //
export default function DirectDebitPopUpForm(props: PropTypes): JSX.Element {
	const { isPopUpOpen } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.directDebit,
	);

	const dispatch = useContributionsDispatch();

	function closePopup() {
		dispatch(setPopupClose());
		dispatch(resetFormError);
	}

	if (isPopUpOpen) {
		return (
			<div className="component-direct-debit-pop-up-form">
				<div className="component-direct-debit-pop-up-form__content">
					<button
						id="qa-pay-with-direct-debit-close-pop-up"
						className="component-direct-debit-pop-up-form__close-button focus-target"
						onClick={closePopup}
					>
						<span>
							<SvgCross />
						</span>
					</button>
					<DirectDebitForm
						onPaymentAuthorisation={props.onPaymentAuthorisation}
					/>
				</div>
			</div>
		);
	}

	return <></>;
}
