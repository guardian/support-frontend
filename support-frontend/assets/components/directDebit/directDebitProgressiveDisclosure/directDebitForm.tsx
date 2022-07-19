// ----- Imports ----- //
import type { AnyAction } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import * as React from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
import {
	payDirectDebitClicked,
	setDirectDebitFormPhase,
	updateAccountHolderConfirmation,
	updateAccountHolderName,
	updateAccountNumber,
	updateSortCodeString,
} from 'components/directDebit/directDebitActions';
import type { ErrorReason } from 'helpers/forms/errorReasons';
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
		sortCodeString: state.page.directDebit.sortCodeString,
		accountNumber: state.page.directDebit.accountNumber,
		accountHolderName: state.page.directDebit.accountHolderName,
		accountHolderConfirmation: state.page.directDebit.accountHolderConfirmation,
		recaptchaCompleted: state.page.checkoutForm.recaptcha.completed,
		formError: state.page.directDebit.formError,
		countryGroupId: state.common.internationalisation.countryGroupId,
		phase: state.page.directDebit.phase,
	};
}

function mapDispatchToProps(
	dispatch: ThunkDispatch<CheckoutState, void, AnyAction>,
) {
	return {
		payDirectDebitClicked: () => {
			void dispatch(payDirectDebitClicked());
			return false;
		},
		editDirectDebitClicked: () => {
			dispatch(setDirectDebitFormPhase('entry'));
		},
		updateSortCodeString: (event: React.ChangeEvent<HTMLInputElement>) => {
			dispatch(updateSortCodeString(event.target.value));
		},
		updateAccountNumber: (event: React.ChangeEvent<HTMLInputElement>) => {
			const accountNumber: string = event.target.value;
			dispatch(updateAccountNumber(accountNumber));
		},
		updateAccountHolderName: (event: React.ChangeEvent<HTMLInputElement>) => {
			const accountHolderName: string = event.target.value;
			dispatch(updateAccountHolderName(accountHolderName));
		},
		updateAccountHolderConfirmation: (
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const accountHolderConfirmation: boolean = event.target.checked;
			dispatch(updateAccountHolderConfirmation(accountHolderConfirmation));
		},
		setRecaptchaToken: (token: string) => {
			dispatch(setRecaptchaToken(token));
		},
		expireRecaptchaToken: () => {
			dispatch(expireRecaptchaToken());
		},
	};
}

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
};

const recaptchaErrorMessage = "Please check the 'I'm not a robot' checkbox";

const fieldValidationFunctions: {
	[key in DirectDebitFieldName]: (fieldValue: string) => boolean;
} = {
	accountHolderName: (fieldValue) =>
		!!/^\D+$/.exec(fieldValue) && nonSillyCharacters(fieldValue),
	sortCodeString: (fieldValue) => !!/^\d{6}$/.exec(fieldValue),
	accountNumber: (fieldValue) => !!/^\d{6,8}$/.exec(fieldValue),
	accountHolderConfirmation: (fieldValue) => !!fieldValue,
};

// ----- Component ----- //
function DirectDebitForm(props: PropTypes) {
	const [fieldErrors, setFieldErrors] = useState<
		Record<DirectDebitFieldName, string>
	>({
		accountHolderName: '',
		sortCodeString: '',
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
		dispatchUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void,
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		setFieldErrors({
			...fieldErrors,
			[fieldName]: '',
		});
		dispatchUpdate(event);
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
				props.payDirectDebitClicked();
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
					sortCodeError={fieldErrors.sortCodeString}
					accountHolderConfirmationError={fieldErrors.accountHolderConfirmation}
					onSubmit={handleErrorsAndCheckAccount}
					onChange={onChange}
				/>
			)}
			{props.phase === 'confirmation' && (
				<Playback
					editDirectDebitClicked={props.editDirectDebitClicked}
					onSubmit={onSubmit}
					accountHolderName={props.accountHolderName}
					accountNumber={props.accountNumber}
					sortCodeString={props.sortCodeString}
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
