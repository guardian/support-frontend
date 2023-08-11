// ----- Imports ----- //
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import SvgCross from 'components/svgs/cross';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import './directDebitPopUpForm.scss';
import {
	resetFormError,
	setPopupClose,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import type { Phase } from 'helpers/redux/checkout/payment/directDebit/state';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';

type PropTypes = {
	buttonText: string;
	onPaymentAuthorisation: (authorisation: PaymentAuthorisation) => void;
};

// ----- Component ----- //
export default function DirectDebitPopUpForm(props: PropTypes): JSX.Element {
	const { isPopUpOpen, phase } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.directDebit,
	);

	const dispatch = useContributionsDispatch();

	function closePopup() {
		dispatch(setPopupClose);
		dispatch(resetFormError);
	}

	if (isPopUpOpen) {
		return (
			<div className="component-direct-debit-pop-up-form">
				<div className="component-direct-debit-pop-up-form__content">
					<h1 className="component-direct-debit-pop-up-form__heading">
						<PageTitle phase={phase} />
					</h1>
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
						buttonText={props.buttonText}
						onPaymentAuthorisation={props.onPaymentAuthorisation}
					/>
				</div>
			</div>
		);
	}

	return <></>;
}

// ----- Auxiliary Components ----- //
function PageTitle(props: { phase: Phase }) {
	if (props.phase === 'confirmation') {
		return (
			<span>
				<span className="component-direct-debit-pop-up-form__heading--title">
					Please confirm
				</span>
				<span className="component-direct-debit-pop-up-form__heading--title">
					your details
				</span>
			</span>
		);
	}

	return (
		<span>
			<span className="component-direct-debit-pop-up-form__heading--title">
				Please enter
			</span>
			<span className="component-direct-debit-pop-up-form__heading--title">
				your details below
			</span>
		</span>
	);
}
