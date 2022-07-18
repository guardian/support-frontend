// ----- Imports ----- //
import { useEffect, useState } from 'react';
import * as React from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import { useRecaptchaV2 } from 'helpers/customHooks/useRecaptcha';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import {
	setAccountHolderConfirmation,
	setAccountHolderName,
	setAccountNumber,
	setPhase,
	setSortCodeString,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import { confirmAccountDetails } from 'helpers/redux/checkout/payment/directDebit/thunks';
import {
	expireRecaptchaToken,
	setRecaptchaToken,
} from 'helpers/redux/checkout/recaptcha/actions';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { nonSillyCharacters } from 'helpers/subscriptionsForms/validation';
import Form from './components/form';
import Playback from './components/playback';
import type { DirectDebitFieldName } from './types';

// ----- Map State/Props ----- //
function mapStateToProps(state: CheckoutState) {
	return {
		sortCodeString: state.page.checkoutForm.payment.directDebit.sortCodeString,
		accountNumber: state.page.checkoutForm.payment.directDebit.accountNumber,
		accountHolderName:
			state.page.checkoutForm.payment.directDebit.accountHolderName,
		accountHolderConfirmation:
			state.page.checkoutForm.payment.directDebit.accountHolderConfirmation,
		recaptchaCompleted: state.page.checkoutForm.recaptcha.completed,
		formError: state.page.checkoutForm.payment.directDebit.formError,
		countryGroupId: state.common.internationalisation.countryGroupId,
		phase: state.page.checkoutForm.payment.directDebit.phase,
	};
}

const mapDispatchToProps = {
	payDirectDebitClicked: confirmAccountDetails,
	setPhase,
	updateSortCodeString: setSortCodeString,
	updateAccountNumber: setAccountNumber,
	updateAccountHolderName: setAccountHolderName,
	updateAccountHolderConfirmation: setAccountHolderConfirmation,
	setRecaptchaToken,
	expireRecaptchaToken,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PropTypes = ConnectedProps<typeof connector> & {
	allErrors: Array<Record<string, string>>;
	buttonText: string;
	submissionErrorHeading: string;
	submissionError: ErrorReason | null;
	submitForm: () => void;
};

const fieldErrorMessages: { [key in DirectDebitFieldName]: string } = {
	accountHolderName: 'Please enter a valid account name',
	sortCodeString: 'Please enter a valid sort code',
	accountNumber: 'Please enter a valid account number',
	accountHolderConfirmation: 'Please confirm you are the account holder',
	recaptcha: "Please check the 'I'm not a robot' checkbox",
};

const fieldValidationFunctions: {
	[key in DirectDebitFieldName]: (fieldValue: string) => boolean;
} = {
	accountHolderName: (fieldValue) =>
		!!/^\D+$/.exec(fieldValue) && nonSillyCharacters(fieldValue),
	sortCodeString: (fieldValue) => !!/^\d{6}$/.exec(fieldValue),
	accountNumber: (fieldValue) => !!/^\d{6,8}$/.exec(fieldValue),
	accountHolderConfirmation: (fieldValue) => !!fieldValue,
	recaptcha: (completed) => !!completed,
};

// ----- Component ----- //
const recaptchaId = 'robot_checkbox';

function DirectDebitForm(props: PropTypes) {
	useRecaptchaV2(
		recaptchaId,
		props.setRecaptchaToken,
		props.expireRecaptchaToken,
	);
	const [fieldErrors, setFieldErrors] = useState<
		Record<DirectDebitFieldName, string>
	>({
		accountHolderName: '',
		sortCodeString: '',
		accountNumber: '',
		accountHolderConfirmation: '',
		recaptcha: '',
	});
	const [allErrors, setAllErrors] = useState<Array<Record<string, string>>>([]);
	const [userHasSubmitted, setUserHasSubmitted] = useState<boolean>(false);

	function onSubmit(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		props.submitForm();
	}

	function onChange(
		fieldName: DirectDebitFieldName,
		dispatchUpdate: () => void,
	) {
		setFieldErrors({
			...fieldErrors,
			[fieldName]: '',
		});
		dispatchUpdate();
	}

	function handleErrorsAndCheckAccount(
		event: React.MouseEvent<HTMLButtonElement>,
	) {
		event.preventDefault();
		const updatedFieldErrors = {
			accountHolderName: fieldValidationFunctions.accountHolderName(
				props.accountHolderName,
			)
				? ''
				: fieldErrorMessages.accountHolderName,
			sortCodeString: fieldValidationFunctions.sortCodeString(
				props.sortCodeString,
			)
				? ''
				: fieldErrorMessages.sortCodeString,
			accountNumber: fieldValidationFunctions.accountNumber(props.accountNumber)
				? ''
				: fieldErrorMessages.accountNumber,
			accountHolderConfirmation:
				fieldValidationFunctions.accountHolderConfirmation(
					props.accountHolderConfirmation ? 'true' : '',
				)
					? ''
					: fieldErrorMessages.accountHolderConfirmation,
			recaptcha: fieldValidationFunctions.recaptcha(
				props.recaptchaCompleted ? 'true' : '',
			)
				? ''
				: fieldErrorMessages.recaptcha,
		};
		setFieldErrors(updatedFieldErrors);
		setAllErrors(
			Object.values(updatedFieldErrors)
				.filter((errorMessage) => errorMessage)
				.map((errorMessage) => ({
					message: errorMessage,
				})),
		);
		setUserHasSubmitted(true);
	}

	useEffect(() => {
		if (userHasSubmitted) {
			if (allErrors.length === 0) {
				void props.payDirectDebitClicked();
			} else {
				setUserHasSubmitted(false);
			}
		}
	}, [allErrors, userHasSubmitted]);

	useEffect(() => {
		setFieldErrors({
			...fieldErrors,
			recaptcha: '',
		});
	}, [props.recaptchaCompleted]);

	return (
		<span>
			{props.phase === 'entry' && (
				<Form
					{...props}
					recaptchaId={recaptchaId}
					showGeneralError={!!props.formError || !!props.submissionError}
					accountErrors={allErrors}
					accountErrorsLength={allErrors.length}
					accountHolderNameError={fieldErrors.accountHolderName}
					accountNumberError={fieldErrors.accountNumber}
					sortCodeError={fieldErrors.sortCodeString}
					accountHolderConfirmationError={fieldErrors.accountHolderConfirmation}
					recaptchaError={fieldErrors.recaptcha}
					onSubmit={handleErrorsAndCheckAccount}
					onChange={onChange}
				/>
			)}
			{props.phase === 'confirmation' && (
				<Playback
					editDirectDebitClicked={() => props.setPhase('entry')}
					onSubmit={onSubmit}
					accountHolderName={props.accountHolderName}
					accountNumber={props.accountNumber}
					sortCodeString={props.sortCodeString}
					buttonText={props.buttonText}
					allErrors={props.allErrors}
				/>
			)}
		</span>
	);
}

// ----- Exports ----- //

export default connector(DirectDebitForm);
