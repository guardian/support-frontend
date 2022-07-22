import { css, ThemeProvider } from '@emotion/react';
import { space, textSans } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrandAlt,
	TextInput,
} from '@guardian/source-react-components';
import React from 'react';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import { emailRegexPattern } from 'helpers/forms/formValidation';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';

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
	setFirstName: (firstName: string) => void;
	lastName: string;
	setLastName: (lastName: string) => void;
	email: string;
	setEmail: (email: string) => void;
	confirmEmail?: string;
	setConfirmEmail?: (confirmEmail: string) => void;
	fetchAndStoreUserType?: (email: string) => void;
	isSignedIn: boolean;
	telephone?: string;
	setTelephone: (telephone: string) => void;
	formErrors: Array<FormError<FormField>>;
	signOut: () => void;
};

type SignedInEmailFooterTypes = {
	handleSignOut: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function SignedInEmailFooter(props: SignedInEmailFooterTypes) {
	return (
		<div css={marginBottom}>
			<CheckoutExpander copy="Want to use a different email address?">
				<p css={sansText}>
					You will be able to edit this in your account once you have completed
					this checkout.
				</p>
			</CheckoutExpander>
			<CheckoutExpander copy="Not you?">
				<p css={paragraphWithButton}>
					<ThemeProvider theme={buttonThemeReaderRevenueBrandAlt}>
						<Button
							type="button"
							data-testid="sign-out"
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
}

function SignedOutEmailFooter() {
	return <div css={marginBottom} />;
}

export default function PersonalDetails(props: PropTypes): JSX.Element {
	const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		props.signOut();
	};

	const maybeFetchAndStoreUsertype = (
		e: React.FocusEvent<HTMLInputElement>,
	) => {
		if (props.fetchAndStoreUserType) {
			props.fetchAndStoreUserType(e.target.value);
		}
	};

	const maybeSetConfirmEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			id="confirm-email"
			data-testid="confirm-email"
			data-qm-masking="blocklist"
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
				data-testid="first-name"
				data-qm-masking="blocklist"
				label="First name"
				type="text"
				value={props.firstName}
				onChange={(e) => props.setFirstName(e.target.value)}
				error={firstError('firstName', props.formErrors)}
			/>
			<TextInput
				css={marginBottom}
				id="last-name"
				data-testid="last-name"
				data-qm-masking="blocklist"
				label="Last name"
				type="text"
				value={props.lastName}
				onChange={(e) => props.setLastName(e.target.value)}
				error={firstError('lastName', props.formErrors)}
			/>
			<TextInput
				css={marginBottom}
				id="email"
				data-testid="email"
				data-qm-masking="blocklist"
				label="Email"
				type="email"
				value={props.email}
				onChange={(e) => props.setEmail(e.target.value)}
				onBlur={maybeFetchAndStoreUsertype}
				error={firstError('email', props.formErrors)}
				pattern={emailRegexPattern}
				disabled={props.isSignedIn}
			/>
			{confirmEmailInput}
			{emailFooter}
			<TextInput
				id="telephone"
				data-testid="telephone"
				data-qm-masking="blocklist"
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
