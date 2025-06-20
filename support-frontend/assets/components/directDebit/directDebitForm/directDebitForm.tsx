import {
	Checkbox,
	InlineError,
	TextInput,
} from '@guardian/source/react-components';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { ReactNode } from 'react';
import { ElementDecorator } from 'components/stripeCardForm/elementDecorator';
import * as styles from './directDebitFormStyles';
import LegalNotice from './legalNotice';
import type { DirectDebitFormDisplayErrors } from './selectors';

export type DirectDebitFormProps = {
	countryGroupId: CountryGroupId;
	accountHolderName: string;
	accountNumber: string;
	accountHolderConfirmation: boolean;
	sortCode: string;
	recaptchaCompleted: boolean;
	updateAccountHolderName: (name: string) => void;
	updateAccountNumber: (number: string) => void;
	updateSortCode: (sortCode: string) => void;
	updateAccountHolderConfirmation: (confirmation: boolean) => void;
	recaptcha: ReactNode;
	formError: string;
	errors: DirectDebitFormDisplayErrors;
	isSundayOnly?: boolean;
};

// ----- Component ----- //
export default function DirectDebitForm(
	props: DirectDebitFormProps,
): JSX.Element {
	return (
		<div>
			{props.formError && (
				<div id="directDebitDetails">
					<InlineError>{props.formError}</InlineError>
				</div>
			)}

			{/** BACS requirement:
        "Name of the account holder, as known by the bank. Usually this is the
        same as the name stored with the linked creditor. This field will be
        transliterated, upcased and truncated to 18 characters."
        https://developer.gocardless.com/api-reference/
      * */}
			<TextInput
				label="Account name"
				id="accountHolderName"
				data-qm-masking="blocklist"
				value={props.accountHolderName}
				onChange={(e) => props.updateAccountHolderName(e.target.value)}
				maxLength={40}
				error={props.errors.accountHolderName?.[0]}
				name="accountHolderName"
			/>

			<div css={styles.accountNumberSortCodeContainer}>
				<div>
					<TextInput
						label="Sort code"
						id="sortCode"
						data-qm-masking="blocklist"
						value={props.sortCode}
						onChange={(e) => props.updateSortCode(e.target.value)}
						pattern="[0-9]*"
						minLength={6}
						maxLength={6}
						inputMode="numeric"
						error={props.errors.sortCode?.[0]}
						name="sortCode"
						required={true}
					/>
				</div>

				<div>
					<TextInput
						label="Account number"
						id="accountNumber"
						data-qm-masking="blocklist"
						value={props.accountNumber}
						onChange={(e) => props.updateAccountNumber(e.target.value)}
						pattern="[0-9]*"
						minLength={6}
						maxLength={10}
						inputMode="numeric"
						error={props.errors.accountNumber?.[0]}
						name="accountNumber"
						required={true}
					/>
				</div>
			</div>

			<Checkbox
				id="accountHolderConfirmation"
				label="I confirm that I am the account holder and I am solely able to
							authorise debit from the account"
				error={!!props.errors.accountHolderConfirmation?.[0]}
				onChange={(e) =>
					props.updateAccountHolderConfirmation(e.target.checked)
				}
				checked={props.accountHolderConfirmation}
				name="accountHolderConfirmation"
				required={true}
			/>

			{props.recaptcha && (
				<div css={styles.recaptcha}>
					<ElementDecorator
						id="robot-checkbox"
						text="Security check"
						error={props.errors.recaptcha?.[0]}
						renderElement={() => props.recaptcha}
					/>
				</div>
			)}

			<LegalNotice
				countryGroupId={props.countryGroupId}
				isSundayOnly={props.isSundayOnly}
			/>
		</div>
	);
}
