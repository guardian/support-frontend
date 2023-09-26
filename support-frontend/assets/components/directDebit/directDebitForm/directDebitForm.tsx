import { css } from '@emotion/react';
import { Checkbox, TextInput } from '@guardian/source-react-components';
import * as React from 'react';
import { useState } from 'react';
import DirectDebitGuarantee from 'components/directDebit/directDebitForm/directDebitGuarantee';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { ElementDecorator } from 'components/stripeCardForm/elementDecorator';
import SvgExclamationAlternate from 'components/svgs/exclamationAlternate';
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
	updateAccountHolderName: (name: string) => void;
	updateAccountNumber: (number: string) => void;
	updateSortCode: (sortCode: string) => void;
	updateAccountHolderConfirmation: (confirmation: boolean) => void;
	recaptcha: React.ReactNode;
	formError: string;
	errors: DirectDebitFormDisplayErrors;
};

// ----- Component ----- //
export default function DirectDebitForm(
	props: DirectDebitFormProps,
): JSX.Element {
	const [guaranteeOpen, setGuaranteeOpen] = useState(false);

	return (
		<div>
			{props.formError && (
				<div
					id="directDebitDetails"
					css={css`
						margin-top: 8px;
					`}
				>
					<ErrorMessage
						message={props.formError}
						svg={<SvgExclamationAlternate />}
					/>
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
			/>

			<div css={accountNumberSortCodeContainer}>
				<div>
					<TextInput
						label="Sort code"
						id="sortCodeString"
						data-qm-masking="blocklist"
						value={props.sortCode}
						onChange={(e) => props.updateSortCode(e.target.value)}
						pattern="[0-9]*"
						minLength={6}
						maxLength={6}
						inputMode="numeric"
						error={props.errors.sortCodeString?.[0]}
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

			<LegalNotice countryGroupId={props.countryGroupId} />

			<DirectDebitGuarantee
				isDDGuaranteeOpen={guaranteeOpen}
				openDirectDebitGuarantee={() => setGuaranteeOpen(true)}
				closeDirectDebitGuarantee={() => setGuaranteeOpen(false)}
			/>
		</div>
	);
}

function LegalNotice(props: { countryGroupId: CountryGroupId }) {
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
				The Guardian, Unit 16, Coalfield Way, Ashby Park, Ashby-De-La-Zouch,
				LE65 1JT United Kingdom
				<br />
				Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays,
				8am-6pm at weekends (GMT/BST)
				<br />
				<a href={contributionsEmail[props.countryGroupId]}>
					{contributionsEmail[props.countryGroupId].replace('mailto:', '')}
				</a>
			</p>
		</div>
	);
}
