import { css } from '@emotion/react';
import { Label } from '@guardian/source-react-components';
import * as React from 'react';
import DirectDebitGuarantee from 'components/directDebit/directDebitForm/directDebitGuarantee';
import SortCodeInput from 'components/directDebit/directDebitForm/sortCodeInput';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { Recaptcha } from 'components/recaptcha/recaptcha';
// import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
// import SvgDirectDebitSymbol from 'components/svgs/directDebitSymbol';
import SvgExclamationAlternate from 'components/svgs/exclamationAlternate';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { contributionsEmail } from 'helpers/legal';
import {
	setAccountHolderConfirmation,
	setAccountHolderName,
	setAccountNumber,
	setDDGuaranteeClose,
	setDDGuaranteeOpen,
	setFormError,
	setSortCode,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import type { SortCodeIndex } from 'helpers/redux/checkout/payment/directDebit/state';
import {
	confirmAccountDetails,
	directDebitErrorMessages,
	payWithDirectDebit,
} from 'helpers/redux/checkout/payment/directDebit/thunks';
import {
	expireRecaptchaToken,
	setRecaptchaToken,
} from 'helpers/redux/checkout/recaptcha/actions';
import './directDebitForm.scss';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import {
	accountHolderConfirmation,
	accountNumberSortCodeContainer,
	confirmationCheckbox,
	confirmationInput,
	confirmationInputContainer,
	confirmationLabel,
	confirmationText,
	fieldLabel,
	legalNotice,
	recaptcha,
	textField,
} from './directDebitFormStyles';

type PropTypes = {
	onPaymentAuthorisation: (authorisation: PaymentAuthorisation) => void;
};

const recaptchaId = 'robot_checkbox';

// ----- Component ----- //
export default function DirectDebitForm(props: PropTypes): JSX.Element {
	const {
		isDDGuaranteeOpen,
		sortCodeArray,
		accountNumber,
		accountHolderName,
		accountHolderConfirmation,
		formError,
	} = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.directDebit,
	);

	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const recaptchaCompleted = useContributionsSelector(
		(state) => state.page.checkoutForm.recaptcha.completed,
	);

	const dispatch = useContributionsDispatch();

	// Currently unused as the payment button is commented out for styling purposes
	void function onSubmit() {
		void confirmAccountDetails();

		if (recaptchaCompleted) {
			void dispatch(payWithDirectDebit(props.onPaymentAuthorisation));
		} else {
			dispatch(setFormError(directDebitErrorMessages.notCompletedRecaptcha));
		}
	};

	return (
		<div>
			<AccountHolderNameInput
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					dispatch(setAccountHolderName(e.target.value))
				}
				value={accountHolderName}
			/>

			<div css={accountNumberSortCodeContainer}>
				<SortCodeInput
					onChange={(
						index: SortCodeIndex,
						e: React.ChangeEvent<HTMLInputElement>,
					) =>
						dispatch(setSortCode({ index, partialSortCode: e.target.value }))
					}
					sortCodeArray={sortCodeArray}
				/>

				<AccountNumberInput
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						dispatch(setAccountNumber(e.target.value))
					}
					value={accountNumber}
				/>
			</div>

			<ConfirmationInput
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					dispatch(setAccountHolderConfirmation(e.target.checked))
				}
				checked={accountHolderConfirmation}
			/>

			<RecaptchaInput
				setRecaptchaToken={(token) => dispatch(setRecaptchaToken(token))}
				expireRecaptchaToken={() => dispatch(expireRecaptchaToken())}
			/>

			{formError && (
				<div
					css={css`
						margin-top: 8px;
					`}
				>
					<ErrorMessage message={formError} svg={<SvgExclamationAlternate />} />
				</div>
			)}

			{/* <PaymentButton onConfirmClick={onSubmit} /> */}

			<LegalNotice countryGroupId={countryGroupId} />

			<DirectDebitGuarantee
				isDDGuaranteeOpen={isDDGuaranteeOpen}
				openDirectDebitGuarantee={setDDGuaranteeOpen}
				closeDirectDebitGuarantee={() => dispatch(setDDGuaranteeClose())}
			/>
		</div>
	);
}

// ----- Auxiliary components ----- //
function AccountNumberInput(props: {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	value: string;
}) {
	return (
		<div>
			<Label
				text="Account number"
				htmlFor="account-number-input"
				css={fieldLabel}
			/>
			<input
				id="account-number-input"
				data-qm-masking="blocklist"
				value={props.value}
				onChange={props.onChange}
				pattern="[0-9]*"
				minLength={6}
				maxLength={10}
				css={textField}
			/>
		</div>
	);
}

/*
 * BACS requirement:
 "Name of the account holder, as known by the bank. Usually this is the
 same as the name stored with the linked creditor. This field will be
 transliterated, upcased and truncated to 18 characters."
 https://developer.gocardless.com/api-reference/
 * */
function AccountHolderNameInput(props: {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div>
			<Label
				text="Account name"
				htmlFor="account-holder-name-input"
				css={css`
					${fieldLabel};
					margin-top: 0 !important;
				`}
			/>
			<input
				id="account-holder-name-input"
				data-qm-masking="blocklist"
				value={props.value}
				onChange={props.onChange}
				maxLength={40}
				css={textField}
			/>
		</div>
	);
}

function RecaptchaInput(props: {
	setRecaptchaToken: (token: string) => void;
	expireRecaptchaToken?: () => void;
}) {
	return (
		<div css={recaptcha}>
			<Label text="Security check" htmlFor={recaptchaId} css={fieldLabel} />
			<Recaptcha
				id={recaptchaId}
				onRecaptchaCompleted={props.setRecaptchaToken}
				onRecaptchaExpired={props.expireRecaptchaToken}
			/>
		</div>
	);
}

function ConfirmationInput(props: {
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div css={accountHolderConfirmation}>
			<div>
				<label htmlFor="confirmation-input">
					<span css={confirmationInputContainer}>
						<div css={confirmationCheckbox}>
							<input
								css={confirmationInput}
								id="confirmation-input"
								type="checkbox"
								onChange={props.onChange}
								checked={props.checked}
							/>
							<label
								id="qa-confirmation-input"
								css={confirmationLabel}
								htmlFor="confirmation-input"
							/>
						</div>
						<span css={confirmationText}>
							I confirm that I am the account holder and I am solely able to
							authorise debit from the account
						</span>
					</span>
				</label>
			</div>
		</div>
	);
}

// function PaymentButton(props: {
// 	onConfirmClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
// }) {
// 	return (
// 		<button
// 			id="qa-submit-button"
// 			className="component-direct-debit-form__cta component-direct-debit-form__cta--pay-button focus-target"
// 			onClick={props.onConfirmClick}
// 		>
// 			<SvgDirectDebitSymbol />
// 			<span className="component-direct-debit-form__cta-text">
// 				Pay with Direct Debit
// 			</span>
// 			<SvgArrowRightStraight />
// 		</button>
// 	);
// }

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
