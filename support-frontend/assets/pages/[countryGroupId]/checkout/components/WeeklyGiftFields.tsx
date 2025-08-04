import { useState } from 'react';
import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';
import { WeeklyDeliveryDates } from './WeeklyDeliveryDates';
import { WeeklyGiftPersonalFields } from './WeeklyGiftPersonalFields';

export function WeeklyGiftFields(): JSX.Element {
	/** Gift recipient details */
	// Session storage unavailable yet, using state
	const [recipientFirstName, setRecipientFirstName] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientLastName, setRecipientLastName] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientEmail, setRecipientEmail] =
		useStateWithCheckoutSession<string>(undefined, '');

	/** Delivery Instructions */
	const weeklyDeliveryDates = getWeeklyDays();
	const [weeklyDeliveryDate, setWeeklyDeliveryDate] = useState<Date>(
		weeklyDeliveryDates[0] as Date,
	);

	return (
		<>
			<WeeklyGiftPersonalFields
				legend={`1. Gift recipient's details`}
				firstName={recipientFirstName}
				setFirstName={(recipientFirstName) =>
					setRecipientFirstName(recipientFirstName)
				}
				lastName={recipientLastName}
				setLastName={(recipientLastName) =>
					setRecipientLastName(recipientLastName)
				}
				email={recipientEmail}
				setEmail={(recipientEmail) => setRecipientEmail(recipientEmail)}
			/>
			<CheckoutDivider spacing="loose" />
			<FormSection>
				<Legend>2. Gift delivery date</Legend>
				<WeeklyDeliveryDates
					weeklyDeliveryDates={weeklyDeliveryDates}
					weeklyDeliveryDateSelected={weeklyDeliveryDate}
					setWeeklyDeliveryDate={(weeklyDeliveryDate) => {
						setWeeklyDeliveryDate(weeklyDeliveryDate);
					}}
				/>
			</FormSection>
			<CheckoutDivider spacing="loose" />
		</>
	);
}
