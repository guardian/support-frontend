// ----- Imports ----- //
import { css, ThemeProvider } from '@emotion/react';
import {
	Button,
	buttonThemeReaderRevenueBrand,
	Checkbox,
	SvgArrowRightStraight,
	TextInput,
} from '@guardian/source-react-components';
import * as React from 'react';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { Option } from 'helpers/types/option';
import type { DirectDebitFieldName } from '../types';

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

type EventHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

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
	accountErrors: Array<Record<string, string>>;
	submissionError: ErrorReason | null;
	submissionErrorHeading: string;
	formError: Option<string>;
	updateAccountHolderName: EventHandler;
	updateSortCodeString: EventHandler;
	updateAccountNumber: EventHandler;
	updateAccountHolderConfirmation: EventHandler;
	onChange: (
		field: DirectDebitFieldName,
		dispatchUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void,
		event: React.ChangeEvent<HTMLInputElement>,
	) => void;
	onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function Form(props: PropTypes): JSX.Element {
	return (
		<div css={directDebitForm}>
			<div css={spaceBetween}>
				<TextInput
					id="account-holder-name-input"
					data-qm-masking="blocklist"
					value={props.accountHolderName}
					autoComplete="off"
					onChange={(e) =>
						props.onChange(
							'accountHolderName',
							props.updateAccountHolderName,
							e,
						)
					}
					maxLength={40}
					label="Bank account holder name"
					error={props.accountHolderNameError}
				/>
			</div>

			<div css={spaceBetween}>
				<TextInput
					id="sort-code-input"
					data-qm-masking="blocklist"
					label="Sort code"
					autoComplete="off"
					type="text"
					inputMode="numeric"
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
					data-qm-masking="blocklist"
					value={props.accountNumber}
					autoComplete="off"
					onChange={(e) =>
						props.onChange('accountNumber', props.updateAccountNumber, e)
					}
					minLength={6}
					maxLength={8}
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					label="Account number"
					error={props.accountNumberError}
				/>
			</div>

			<div css={[spaceBetween, passThroughClicksToInput]}>
				<Checkbox
					value="account-holder-confirmation"
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
					error={!!props.accountHolderConfirmationError}
				/>
			</div>

			<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
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
					errorReason={props.submissionError ?? props.formError}
					errorHeading={props.submissionErrorHeading}
				/>
			)}
		</div>
	);
}

export default Form;
