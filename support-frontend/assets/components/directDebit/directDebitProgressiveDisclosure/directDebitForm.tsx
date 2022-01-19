// ----- Imports ----- //
import React, { useEffect, useState } from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { Action } from 'components/directDebit/directDebitActions';
import {
	payDirectDebitClicked,
	setDirectDebitFormPhase,
	updateAccountHolderConfirmation,
	updateAccountHolderName,
	updateAccountNumber,
	updateSortCodeString,
} from 'components/directDebit/directDebitActions';
import type { ErrorReason } from 'helpers/forms/errorReasons';
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
		formError: state.page.directDebit.formError,
		countryGroupId: state.common.internationalisation.countryGroupId,
		phase: state.page.directDebit.phase,
	};
}

function mapDispatchToProps(
	dispatch: ThunkDispatch<CheckoutState, void, Action>,
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
	const [userHasSubmitted, setUserHasSubmitted] = useState<boolean>(false);

	function onSubmit(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		props.submitForm();
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
		setUserHasSubmitted(true);
	}

	useEffect(() => {
		setAllErrors(
			Object.values(fieldErrors)
				.filter((errorMessage) => errorMessage)
				.map((errorMessage) => ({
					message: errorMessage,
				})),
		);
	}, [fieldErrors]);

	useEffect(() => {
		if (userHasSubmitted) {
			if (allErrors.length === 0) {
				props.payDirectDebitClicked();
			} else {
				setUserHasSubmitted(false);
			}
		}
	}, [allErrors, userHasSubmitted]);

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
					accountHolderConfirmationError={fieldErrors.accountHolderName}
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
				/>
			)}
		</span>
	);
}

// class DirectDebitForm extends Component<PropTypes, StateTypes> {
// 	constructor(props: PropTypes) {
// 		super(props);
// 		this.state = {
// 			accountHolderName: {
// 				error: '',
// 				message: 'Please enter a valid account name',
// 				// Regex matches a string with any character that is not a digit
// 				rule: (accountHolderName) =>
// 					accountHolderName.match(/^\D+$/) &&
// 					nonSillyCharacters(accountHolderName),
// 			},
// 			sortCodeString: {
// 				error: '',
// 				message: 'Please enter a valid sort code',
// 				// Regex matches a string with exactly 6 digits
// 				rule: (sortCodeString) => sortCodeString.match(/^\d{6}$/),
// 			},
// 			accountNumber: {
// 				error: '',
// 				message: 'Please enter a valid account number',
// 				// Regex matches a string with between 6 and 8 digits
// 				rule: (accountNumber) => accountNumber.match(/^\d{6,8}$/),
// 			},
// 			accountHolderConfirmation: {
// 				error: '',
// 				message: 'Please confirm you are the account holder',
// 				rule: (accountHolderConfirmation) => accountHolderConfirmation === true,
// 			},
// 			allErrors: [],
// 			accountErrorsLength: 0,
// 			allErrorsLength: 0,
// 			canSubmit: false,
// 		};
// 	}

// 	onChange = (field, dispatchUpdate, event) => {
// 		this.setState(
// 			{
// 				[field]: { ...this.state[field], error: '' },
// 			},
// 			this.getAccountErrors,
// 		);
// 		dispatchUpdate(event);
// 	};
// 	onSubmit = (event) => {
// 		event.preventDefault();
// 		this.props.submitForm();
// 	};
// 	getAccountErrors = () => {
// 		const cardErrors = [];
// 		fieldNames.forEach((field) => {
// 			if (this.state[field].error.length > 0) {
// 				cardErrors.push({
// 					message: this.state[field].error,
// 				});
// 			}
// 		});
// 		this.setState({
// 			allErrors: cardErrors,
// 		});
// 	};
// 	getAccountErrorsLength = () => {
// 		let accum = 0;
// 		this.state.allErrors.forEach((item) => {
// 			if (item.message.length > 0) {
// 				accum += 1;
// 			}
// 		});
// 		return accum;
// 	};
// 	handleErrorsAndCheckAccount = (event) => {
// 		event.preventDefault();
// 		const { props } = this;
// 		// Build up a new state for the fields and the error count
// 		const updatedStateWithErrors = fieldNames.reduce(
// 			(updatedState, fieldName) => {
// 				const hasError = !this.state[fieldName].rule(props[fieldName]);

// 				if (hasError) {
// 					return {
// 						...updatedState,
// 						accountErrorsLength: updatedState.accountErrorsLength + 1,
// 						[fieldName]: {
// 							...this.state[fieldName],
// 							error: this.state[fieldName].message,
// 						},
// 					};
// 				}

// 				return { ...updatedState, [fieldName]: { ...this.state[fieldName] } };
// 			},
// 			{
// 				accountErrorsLength: 0,
// 			},
// 		);
// 		this.setState(updatedStateWithErrors, () => {
// 			if (this.state.accountErrorsLength === 0) {
// 				props.payDirectDebitClicked();
// 			}
// 		});
// 	};

// 	render() {
// 		const { props, state } = this;
// 		const accountErrorsLength = this.getAccountErrorsLength();
// 		const showGeneralError =
// 			props.allErrors.length === 0 &&
// 			accountErrorsLength === 0 &&
// 			(props.submissionError !== null ||
// 				(props.formError !== null && props.formError.length > 0));
// 		return (
// 			<span>
// 				{props.phase === 'entry' && (
// 					<Form
// 						{...props}
// 						showGeneralError={showGeneralError}
// 						accountErrors={this.state.allErrors}
// 						accountErrorsLength={accountErrorsLength}
// 						accountHolderNameError={state.accountHolderName.error}
// 						accountNumberError={state.accountNumber.error}
// 						sortCodeError={state.sortCodeString.error}
// 						accountHolderConfirmationError={
// 							state.accountHolderConfirmation.error
// 						}
// 						onChange={this.onChange}
// 						onSubmit={this.handleErrorsAndCheckAccount}
// 					/>
// 				)}
// 				{props.phase === 'confirmation' && (
// 					<Playback
// 						editDirectDebitClicked={props.editDirectDebitClicked}
// 						onSubmit={this.onSubmit}
// 						accountHolderName={props.accountHolderName}
// 						accountNumber={props.accountNumber}
// 						sortCodeString={props.sortCodeString}
// 						buttonText={props.buttonText}
// 						allErrors={props.allErrors}
// 					/>
// 				)}
// 			</span>
// 		);
// 	}
// }

// ----- Exports ----- //

export default connector(DirectDebitForm);
