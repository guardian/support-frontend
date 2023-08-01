// ----- Imports ----- //
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import SvgCross from 'components/svgs/cross';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import './directDebitPopUpForm.scss';
import {
	resetFormError,
	setPopupClose,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

// ----- Map State/Props ----- //
function mapStateToProps(state: ContributionsState) {
	return {
		isPopUpOpen: state.page.checkoutForm.payment.directDebit.isPopUpOpen,
	};
}

const mapDispatchToProps = {
	setPopupClose,
	resetFormError,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector> & {
	buttonText: string;
	onPaymentAuthorisation: (authorisation: PaymentAuthorisation) => void;
};

function DirectDebitPopUpForm(props: PropTypes): JSX.Element {
	function closePopup() {
		props.setPopupClose();
		props.resetFormError();
	}

	if (props.isPopUpOpen) {
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
						buttonText={props.buttonText}
						onPaymentAuthorisation={props.onPaymentAuthorisation}
					/>
				</div>
			</div>
		);
	}

	return <></>;
}

export default connector(DirectDebitPopUpForm);
