import {
	Checkbox,
	InlineError,
	TextInput,
} from '@guardian/source/react-components';
import type { ReactNode } from 'react';
import DirectDebitGuarantee from 'components/directDebit/directDebitForm/directDebitGuarantee';
import { ElementDecorator } from 'components/stripeCardForm/elementDecorator';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { contributionsEmail } from 'helpers/legal';
import {
	accountNumberSortCodeContainer,
	legalNotice,
	recaptcha,
} from './directDebitFormStyles';
import type { DirectDebitFormDisplayErrors } from './selectors';

export type DirectDebitFormProps = {
	countryGroupId: CountryGroupId;
	accountHolderName: string;
	accountNumber: string;
	accountHolderConfirmation: boolean;
	sortCode: string;
	recaptchaCompleted: boolean;
	isSundayOnly: boolean;
	updateAccountHolderName: (name: string) => void;
	updateAccountNumber: (number: string) => void;
	updateSortCode: (sortCode: string) => void;
	updateAccountHolderConfirmation: (confirmation: boolean) => void;
	recaptcha: ReactNode;
	formError: string;
	errors: DirectDebitFormDisplayErrors;
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

			<div css={accountNumberSortCodeContainer}>
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
				<div css={recaptcha}>
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
			<DirectDebitGuarantee />
		</div>
	);
}

function LegalNotice(props: {
	countryGroupId: CountryGroupId;
	isSundayOnly: boolean;
}) {
	if (props.isSundayOnly) {
		return (
			<div css={legalNotice}>
				<p>
					<strong>Payments by GoCardless</strong>
					<br />
					Read the{' '}
					<a href="https://gocardless.com/privacy">GoCardless privacy notice</a>
				</p>
				<p>
					<strong>Advance notice</strong>
					<br />
					The details of your Direct Debit instruction including payment
					schedule, due date, frequency and amount will be sent to you within
					three working days. All the normal Direct Debit safeguards and
					guarantees apply, protected by the Direct Debit guarantee.
				</p>
				<p>
					Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays,
					8am-6pm at weekends (GMT/BST){' '}
				</p>
			</div>
		);
	}

	return (
		<div css={legalNotice}>
			<p>
				<strong>Payments by GoCardless </strong>
				<a
					href="https://gocardless.com/legal/privacy/"
					target="_blank"
					rel="noopener noreferrer"
				>
					read the GoCardless privacy notice.
				</a>
			</p>
			<p>
				<strong>Advance notice</strong> The details of your Direct Debit
				instruction including payment schedule, due date, frequency and amount
				will be sent to you within three working days. All the normal Direct
				Debit safeguards and guarantees apply.
			</p>
			<p>
				<strong>Direct Debit</strong>
				<address>
					The Guardian, Mease Mill, Westminster Industrial Estate, Measham,
					Swadlincote, DE12 7DS
				</address>
				<br />
				Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays,
				9am-6pm at weekends (GMT/BST)
				<br />
				<a href={contributionsEmail[props.countryGroupId]}>
					{contributionsEmail[props.countryGroupId].replace('mailto:', '')}
				</a>
			</p>
		</div>
	);
}
