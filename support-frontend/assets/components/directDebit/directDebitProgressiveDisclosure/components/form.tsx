// ----- Imports ----- //
import { css } from '@emotion/core';
import { Button, buttonReaderRevenueBrand } from '@guardian/src-button';
import { Checkbox } from '@guardian/src-checkbox';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { TextInput } from '@guardian/src-text-input';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import 'helpers/forms/errorReasons';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';

const directDebitForm = css`
	clear: left;
	margin-top: 20px;
	margin-left: 0;
`;
const spaceBetween = css`
	margin-bottom: 20px;
`;
// Quick & dirty fix for the <span> that overlays the checkbox for animation purposes intercepting click
// events and thus breaking our Selenium tests
// TODO: Remove this once a PR to Source has been made to fix this on the component itself
const passThroughClicksToInput = css`
	& span {
		pointer-events: none;
	}
`;
type EventHandler = (e: React.SyntheticEvent<HTMLInputElement>) => void;
type PropTypes = {
	accountHolderName: string;
	sortCodeString: string;
	accountNumber: string;
	accountHolderConfirmation: boolean;
	accountHolderNameError: string;
	sortCodeError: string;
	accountNumberError: string;
	accountHolderConfirmationError: string;
	showGeneralError: boolean;
	accountErrorsLength: number;
	accountErrors: Array<Record<string, any>>;
	submissionError: ErrorReason | null;
	submissionErrorHeading: string;
	formError: Option<string>;
	updateAccountHolderName: EventHandler;
	updateSortCodeString: EventHandler;
	updateAccountNumber: EventHandler;
	updateAccountHolderConfirmation: EventHandler;
	onChange: (
		field: string,
		dispatchUpdate: (...args: any[]) => any,
		event: React.SyntheticEvent<HTMLInputElement>,
	) => void;
	onSubmit: EventHandler;
};

function Form(props: PropTypes) {
	return (
		<div css={directDebitForm}>
			<div css={spaceBetween}>
				<TextInput
					id="account-holder-name-input"
					value={props.accountHolderName}
					autoComplete="off"
					onChange={(e) =>
						props.onChange(
							'accountHolderName',
							props.updateAccountHolderName,
							e,
						)
					}
					maxLength="40"
					label="Bank account holder name"
					error={props.accountHolderNameError}
				/>
			</div>

			<div css={spaceBetween}>
				<TextInput
					id="sort-code-input"
					label="Sort code"
					autoComplete="off"
					type="text"
					inputmode="numeric"
					pattern="[0-9]*"
					value={props.sortCodeString}
					onChange={(e) =>
						props.onChange('sortCodeString', props.updateSortCodeString, e)
					}
					error={props.sortCodeError}
					minLength={6}
					maxLength={6}
					width={10}
				/>
			</div>

			<div css={spaceBetween}>
				<TextInput
					id="account-number-input"
					value={props.accountNumber}
					autoComplete="off"
					onChange={(e) =>
						props.onChange('accountNumber', props.updateAccountNumber, e)
					}
					minLength={6}
					maxLength={8}
					type="text"
					inputmode="numeric"
					pattern="[0-9]*"
					label="Account number"
					error={props.accountNumberError}
				/>
			</div>

			<div css={[spaceBetween, passThroughClicksToInput]}>
				<Checkbox
					id="account-holder-confirmation"
					onChange={(e) =>
						props.onChange(
							'accountHolderConfirmation',
							props.updateAccountHolderConfirmation,
							e,
						)
					}
					checked={props.accountHolderConfirmation}
					supporting="I confirm that I am the account holder and I am solely able to authorise debit from
          the account"
					error={props.accountHolderConfirmationError}
				/>
			</div>
			<ThemeProvider theme={buttonReaderRevenueBrand}>
				<Button
					id="qa-direct-debit-submit"
					onClick={props.onSubmit}
					priority="primary"
					icon={<SvgArrowRightStraight />}
					iconSide="right"
				>
					Confirm
				</Button>
			</ThemeProvider>
			{props.accountErrorsLength > 0 && (
				<ErrorSummary errors={[...props.accountErrors]} />
			)}
			{props.showGeneralError && (
				<GeneralErrorMessage
					errorReason={props.submissionError || props.formError}
					errorHeading={props.submissionErrorHeading}
				/>
			)}
		</div>
	);
}

export default Form;
