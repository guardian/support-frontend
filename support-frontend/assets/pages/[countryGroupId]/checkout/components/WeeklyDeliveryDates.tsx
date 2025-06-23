import { Radio, RadioGroup } from '@guardian/source/react-components';
import Rows from 'components/base/rows';
import {
	firstError,
	type FormError,
} from 'helpers/subscriptionsForms/validation';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';

type WeeklyDeliveryDatesProps = {
	weeklyDeliveryDate: string;
	formErrors: Array<FormError<string>>;
	setWeeklyDeliveryDate: (date: string) => void;
};

export function WeeklyDeliveryDates({
	formErrors,
	weeklyDeliveryDate,
	setWeeklyDeliveryDate,
}: WeeklyDeliveryDatesProps) {
	const days = getWeeklyDays();
	return (
		<div>
			<Rows>
				<RadioGroup
					id="startDate"
					name="startDate"
					error={firstError('startDate', formErrors) as string}
				>
					{days
						.filter((day) => {
							const invalidPublicationDates = ['-12-24', '-12-25', '-12-30'];
							const date = formatMachineDate(day);
							return !invalidPublicationDates.some((dateSuffix) =>
								date.endsWith(dateSuffix),
							);
						})
						.map((day) => {
							const [userDate, machineDate] = [
								formatUserDate(day),
								formatMachineDate(day),
							];

							return (
								<Radio
									label={userDate}
									value={userDate}
									name={machineDate}
									checked={machineDate === weeklyDeliveryDate}
									onChange={() => setWeeklyDeliveryDate(machineDate)}
								/>
							);
						})}
				</RadioGroup>
			</Rows>
		</div>
	);
}
