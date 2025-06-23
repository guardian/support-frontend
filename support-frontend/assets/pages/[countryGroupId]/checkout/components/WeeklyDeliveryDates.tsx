import { Radio, RadioGroup } from '@guardian/source/react-components';
import Rows from 'components/base/rows';
import { setStartDate } from 'helpers/redux/checkout/product/actions';
import { firstError, FormError } from 'helpers/subscriptionsForms/validation';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';

type WeeklyDeliveryDatesProps = {
	startDate: string;
	formErrors: Array<FormError<string>>;
};

export function WeeklyDeliveryDates({
	startDate,
	formErrors,
}: WeeklyDeliveryDatesProps) {
	const days = getWeeklyDays();
	return (
		<div>
			<Rows>
				<RadioGroup
					id="startDate"
					name="startDate"
					error={firstError('startDate', formErrors) as string}
					label="Gift delivery date"
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
									checked={machineDate === startDate}
									onChange={() => setStartDate(machineDate)}
								/>
							);
						})}
				</RadioGroup>
			</Rows>
		</div>
	);
}
