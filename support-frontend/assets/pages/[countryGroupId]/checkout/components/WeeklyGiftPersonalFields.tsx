import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { PersonalEmailFields } from './PersonalEmailFields';
import { PersonalFields } from './PersonalFields';

type PersonalGiftDetailsFieldsProps = {
	legend: string;
	recipientFirstName: string;
	setRecipientFirstName: (value: string) => void;
	recipientLastName: string;
	setRecipientLastName: (value: string) => void;
	recipientEmail: string;
	setRecipientEmail: (value: string) => void;
};

export function WeeklyGiftPersonalFields({
	legend,
	recipientFirstName,
	setRecipientFirstName,
	recipientLastName,
	setRecipientLastName,
	recipientEmail,
	setRecipientEmail,
}: PersonalGiftDetailsFieldsProps) {
	return (
		<>
			<FormSection>
				<Legend>{legend}</Legend>
				<PersonalFields
					firstName={recipientFirstName}
					setFirstName={setRecipientFirstName}
					lastName={recipientLastName}
					setLastName={setRecipientLastName}
					endUser={'recipient'}
				/>
				<PersonalEmailFields
					email={recipientEmail}
					setEmail={setRecipientEmail}
					endUser={'recipient'}
				/>
			</FormSection>
			<CheckoutDivider spacing="loose" />
		</>
	);
}
