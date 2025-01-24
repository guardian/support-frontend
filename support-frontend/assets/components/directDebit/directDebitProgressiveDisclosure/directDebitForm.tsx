// ----- Imports ----- //
import { useEffect, useState } from 'react';
import * as React from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import {
	setAccountHolderConfirmation,
	setAccountHolderName,
	setAccountNumber,
	setPhase,
	setSortCode,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import { confirmAccountDetails } from 'helpers/redux/checkout/payment/directDebit/thunks';
import {
	expireRecaptchaToken,
	setRecaptchaToken,
} from 'helpers/redux/checkout/recaptcha/actions';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { zuoraCompatibleString } from 'helpers/subscriptionsForms/validation';
import Form from './components/form';
import Playback from './components/playback';
import type { DirectDebitFieldName } from './types';

// ----- Map State/Props ----- //
function mapStateToProps(state: CheckoutState) {
	return {
		sortCode: state.page.checkoutForm.payment.directDebit.sortCode,
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
	confirmAccountDetails,
	setPhase,
	updateSortCode: setSortCode,
	updateAccountNumber: setAccountNumber,
	updateAccountHolderName: setAccountHolderName,
	updateAccountHolderConfirmation: setAccountHolderConfirmation,
	setRecaptchaToken,
	expireRecaptchaToken,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector> & {
	allErrors: Array<Record<string, string>>;
	buttonText: string;
	submissionErrorHeading: string;
	submissionError: ErrorReason | null;
	submitForm: () => void;
};

const fieldErrorMessages: { [key in DirectDebitFieldName]: string } = {
	accountHolderName: 'Please enter a valid account name',
	sortCode: 'Please enter a valid sort code',
	accountNumber: 'Please enter a valid account number',
	accountHolderConfirmation: 'Please confirm you are the account holder',
};

const recaptchaErrorMessage = "Please check the 'I'm not a robot' checkbox";

const fieldValidationFunctions: {
	[key in DirectDebitFieldName]: (fieldValue: string) => boolean;
} = {
	accountHolderName: (fieldValue) =>
		!!/^\D+$/.exec(fieldValue) && zuoraCompatibleString(fieldValue),
	sortCode: (fieldValue) => !!/^\d{6}$/.exec(fieldValue),
	accountNumber: (fieldValue) => !!/^\d{6,8}$/.exec(fieldValue),
	accountHolderConfirmation: (fieldValue) => !!fieldValue,
};

// ----- Component ----- //
function DirectDebitForm(props: PropTypes) {
	const [fieldErrors, setFieldErrors] = useState<
		Record<DirectDebitFieldName, string>
	>({
		accountHolderName: '',
		sortCode: '',
		accountNumber: '',
		accountHolderConfirmation: '',
	});
	const [allErrors, setAllErrors] = useState<Array<Record<string, string>>>([]);
	const [recaptchaError, setRecaptchaError] = useState('');
	const [userHasSubmitted, setUserHasSubmitted] = useState<boolean>(false);

	function onSubmit(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		if (!props.recaptchaCompleted) {
			setRecaptchaError(recaptchaErrorMessage);
		} else {
			props.submitForm();
		}
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
			sortCode: fieldValidationFunctions.sortCode(props.sortCode)
				? ''
				: fieldErrorMessages.sortCode,
			accountNumber: fieldValidationFunctions.accountNumber(props.accountNumber)
				? ''
				: fieldErrorMessages.accountNumber,
			accountHolderConfirmation:
				fieldValidationFunctions.accountHolderConfirmation(
					props.accountHolderConfirmation ? 'true' : '',
				)
					? ''
					: fieldErrorMessages.accountHolderConfirmation,
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
				void props.confirmAccountDetails();
			} else {
				setUserHasSubmitted(false);
			}
		}
	}, [allErrors, userHasSubmitted]);

	useEffect(() => {
		setRecaptchaError('');
	}, [props.recaptchaCompleted]);

	return (
		<span>
			{props.phase === 'entry' && (
				<Form
					{...props}
					showGeneralError={!!props.formError || !!props.submissionError}
					accountErrors={allErrors}
					accountErrorsLength={allErrors.length}
					accountHolderNameError={fieldErrors.accountHolderName}
					accountNumberError={fieldErrors.accountNumber}
					sortCodeError={fieldErrors.sortCode}
					accountHolderConfirmationError={fieldErrors.accountHolderConfirmation}
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
					sortCode={props.sortCode}
					buttonText={props.buttonText}
					allErrors={props.allErrors}
					setRecaptchaToken={props.setRecaptchaToken}
					expireRecaptchaToken={props.expireRecaptchaToken}
					recaptchaError={recaptchaError}
				/>
			)}
		</span>
	);
}

// ----- Exports ----- //

export default connector(DirectDebitForm);
