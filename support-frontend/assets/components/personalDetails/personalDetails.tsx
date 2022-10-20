// ----- Imports ----- //
import { TextInput } from '@guardian/source-react-components';
import Signout from 'components/signout/signout';
import { emailRegexPattern } from 'helpers/forms/formValidation';
import { classNameWithModifiers } from 'helpers/utilities/utilities';

export type PersonalDetailsProps = {
	email: string;
	firstName: string;
	lastName: string;
	onEmailChange: (email: string) => void;
	onFirstNameChange: (firstName: string) => void;
	onLastNameChange: (lastName: string) => void;
};

export function PersonalDetails({
	email,
	firstName,
	lastName,
	onEmailChange,
	onFirstNameChange,
	onLastNameChange,
}: PersonalDetailsProps): JSX.Element {
	return (
		<div className="form-fields">
			<h3 className="hidden-heading">Your details</h3>

			<div
				className={classNameWithModifiers('form__field', [
					'contribution-email',
				])}
			>
				<TextInput
					id="contributionEmail"
					data-qm-masking="blocklist"
					label="Email address"
					value={email}
					type="email"
					autoComplete="email"
					supporting="example@domain.com"
					onChange={(e) => onEmailChange(e.target.value)}
					pattern={emailRegexPattern}
				/>
			</div>

			<Signout />

			<div>
				<div
					className={classNameWithModifiers('form__field', [
						'contribution-fname',
					])}
				>
					<TextInput
						id="contributionFirstName"
						data-qm-masking="blocklist"
						label="First name"
						value={firstName}
						autoComplete="given-name"
						autoCapitalize="words"
						onChange={(e) => onFirstNameChange(e.target.value)}
						required
					/>
				</div>
				<div
					className={classNameWithModifiers('form__field', [
						'contribution-lname',
					])}
				>
					<TextInput
						id="contributionLastName"
						data-qm-masking="blocklist"
						label="Last name"
						value={lastName}
						autoComplete="family-name"
						autoCapitalize="words"
						onChange={(e) => onLastNameChange(e.target.value)}
						required
					/>
				</div>
			</div>
		</div>
	);
}

export default PersonalDetails;
