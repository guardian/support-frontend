import { css } from '@emotion/react';
import { Button, buttonReaderRevenueBrandAlt } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { textSans } from '@guardian/src-foundations/typography';
import { TextInput } from '@guardian/src-text-input';
import { ThemeProvider } from '@emotion/react';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import { emailRegexPattern } from 'helpers/forms/formValidation';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import 'helpers/subscriptionsForms/formFields';

const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;
const sansText = css`
	${textSans.medium()};
`;
const paragraphWithButton = css`
	margin-top: ${space[2]}px;
	${textSans.medium()};
`;
export type PropTypes = {
	firstName: string;
	setFirstName: (...args: any[]) => any;
	lastName: string;
	setLastName: (...args: any[]) => any;
	email: string;
	setEmail: (...args: any[]) => any;
	confirmEmail?: Option<string>;
	setConfirmEmail?: Option<(...args: any[]) => any>;
	fetchAndStoreUserType?: Option<(...args: any[]) => any>;
	isSignedIn: boolean;
	telephone: Option<string>;
	setTelephone: (...args: any[]) => any;
	formErrors: Array<FormError<FormField>>;
	signOut: (...args: any[]) => any;
};
type SignedInEmailFooterTypes = {
	handleSignOut: (...args: any[]) => any;
};

const SignedInEmailFooter = (props: SignedInEmailFooterTypes) => (
	<div css={marginBottom}>
		<CheckoutExpander copy="Want to use a different email address?">
			<p css={sansText}>
				You will be able to edit this in your account once you have completed
				this checkout.
			</p>
		</CheckoutExpander>
		<CheckoutExpander copy="Not you?">
			<p css={paragraphWithButton}>
				<ThemeProvider theme={buttonReaderRevenueBrandAlt}>
					<Button
						icon={null}
						type="button"
						onClick={(e) => props.handleSignOut(e)}
						priority="tertiary"
						size="small"
					>
						Sign out
					</Button>{' '}
					and create a new account.
				</ThemeProvider>
			</p>
		</CheckoutExpander>
	</div>
);

const SignedOutEmailFooter = () => <div css={marginBottom} />;

export default function PersonalDetails(props: PropTypes) {
	const handleSignOut = (e) => {
		e.preventDefault();
		props.signOut();
	};

	const maybeSetEmail = (e) => {
		if (props.setEmail) {
			props.setEmail(e.target.value);
		}
	};

	const maybeFetchAndStoreUsertype = (e) => {
		if (props.fetchAndStoreUserType) {
			props.fetchAndStoreUserType(e.target.value);
		}
	};

	const maybeSetConfirmEmail = (e) => {
		if (props.setConfirmEmail) {
			props.setConfirmEmail(e.target.value);
		}
	};

	const emailFooter = props.isSignedIn ? (
		<SignedInEmailFooter handleSignOut={handleSignOut} />
	) : (
		<SignedOutEmailFooter />
	);
	const confirmEmailInput = props.isSignedIn ? null : (
		<TextInput
			label="Confirm email"
			type="email"
			value={props.confirmEmail}
			onChange={maybeSetConfirmEmail}
			error={firstError('confirmEmail', props.formErrors)}
			pattern={emailRegexPattern}
		/>
	);
	return (
		<div id="qa-personal-details">
			<TextInput
				css={marginBottom}
				id="first-name"
				label="First name"
				type="text"
				value={props.firstName}
				onChange={(e) => props.setFirstName(e.target.value)}
				error={firstError('firstName', props.formErrors)}
			/>
			<TextInput
				css={marginBottom}
				id="last-name"
				label="Last name"
				type="text"
				value={props.lastName}
				onChange={(e) => props.setLastName(e.target.value)}
				error={firstError('lastName', props.formErrors)}
			/>
			<TextInput
				css={marginBottom}
				label="Email"
				type="email"
				value={props.email}
				onChange={maybeSetEmail}
				onBlur={maybeFetchAndStoreUsertype}
				error={firstError('email', props.formErrors)}
				pattern={emailRegexPattern}
				disabled={props.isSignedIn}
			/>
			{confirmEmailInput}
			{emailFooter}
			<TextInput
				id="telephone"
				label="Telephone"
				optional
				type="tel"
				value={props.telephone}
				onChange={(e) => props.setTelephone(e.target.value)}
				supporting="We may use this to get in touch with you about your subscription."
				error={firstError('telephone', props.formErrors)}
			/>
		</div>
	);
}
PersonalDetails.defaultProps = {
	confirmEmail: null,
	setConfirmEmail: null,
	fetchAndStoreUserType: null,
};
