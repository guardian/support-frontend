// ----- Imports ----- //
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Phase } from 'components/directDebit/directDebitActions';
import type { Action } from 'components/directDebit/directDebitActions';
import {
	closeDirectDebitPopUp,
	resetDirectDebitFormError,
} from 'components/directDebit/directDebitActions';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import SvgCross from 'components/svgs/cross';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import './directDebitPopUpForm.scss';
// ---- Types ----- //
type PropTypes = {
	buttonText: string;
	onPaymentAuthorisation: (arg0: PaymentAuthorisation) => void;
	isPopUpOpen: boolean;
	closeDirectDebitPopUp: () => void;
	phase: Phase;
};

// ----- Map State/Props ----- //
function mapStateToProps(state) {
	return {
		isPopUpOpen: state.page.directDebit.isPopUpOpen,
		phase: state.page.directDebit.phase,
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		closeDirectDebitPopUp: () => {
			dispatch(closeDirectDebitPopUp());
			dispatch(resetDirectDebitFormError());
		},
	};
}

// ----- Component ----- //
const DirectDebitPopUpForm = (props: PropTypes) => {
	let content = null;

	if (props.isPopUpOpen) {
		content = (
			<div className="component-direct-debit-pop-up-form">
				<div className="component-direct-debit-pop-up-form__content">
					<h1 className="component-direct-debit-pop-up-form__heading">
						<PageTitle phase={props.phase} />
					</h1>
					<button
						id="qa-pay-with-direct-debit-close-pop-up"
						className="component-direct-debit-pop-up-form__close-button focus-target"
						onClick={props.closeDirectDebitPopUp}
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

	return content;
};

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
} // ----- Exports ----- //

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DirectDebitPopUpForm);
