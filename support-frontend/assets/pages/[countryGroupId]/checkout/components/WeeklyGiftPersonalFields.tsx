import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import { PersonalEmailFields } from './PersonalEmailFields';
import { PersonalFields } from './PersonalFields';

type PersonalGiftDetailsFieldsProps = {
	legend: string;
	firstName: string;
	setFirstName: (value: string) => void;
	lastName: string;
	setLastName: (value: string) => void;
	email: string;
	setEmail: (value: string) => void;
};

export function WeeklyGiftPersonalFields({
	legend,
	firstName,
	setFirstName,
	lastName,
	setLastName,
	email,
	setEmail,
}: PersonalGiftDetailsFieldsProps) {
	return (
		<FormSection>
			<Legend>{legend}</Legend>
			<PersonalFields
				firstName={firstName}
				setFirstName={setFirstName}
				lastName={lastName}
				setLastName={setLastName}
				email={email}
				setEmail={setEmail}
				endUser={'recipient'}
			/>
			<PersonalEmailFields
				email={email}
				setEmail={setEmail}
				endUser={'recipient'}
			/>
		</FormSection>
	);
}
