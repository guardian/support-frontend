import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
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
import {
	checkedRadioBox,
	checkedRadioLabelColour,
	defaultRadioBox,
	defaultRadioLabelColour,
	radioPadding,
} from 'pages/[countryGroupId]/components/paymentMethod';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';

const weeklyInfo = css`
	margin-top: ${space[5]}px;
`;

type WeeklyDeliveryDatesProps = {
	deliveryDateChecked: Date;
	formErrors: Array<FormError<string>>;
	setWeeklyDeliveryDate: (deliveryDate: Date) => void;
};

export function WeeklyDeliveryDates({
	formErrors,
	deliveryDateChecked,
	setWeeklyDeliveryDate,
}: WeeklyDeliveryDatesProps) {
	const weeklyDays = getWeeklyDays();
	return (
		<>
			<Rows>
				<RadioGroup
					id="startDate"
					name="startDate"
					error={firstError('startDate', formErrors) as string}
				>
					{weeklyDays
						.filter((day) => {
							const invalidPublicationDates = ['-12-24', '-12-25', '-12-30'];
							const date = formatMachineDate(day);
							return !invalidPublicationDates.some((dateSuffix) =>
								date.endsWith(dateSuffix),
							);
						})
						.map((validDay) => {
							const [userDate, machineDate] = [
								formatUserDate(validDay),
								formatMachineDate(validDay),
							];
							const isChecked =
								machineDate === formatMachineDate(deliveryDateChecked);
							return (
								<div
									css={[
										radioPadding,
										isChecked ? checkedRadioBox : defaultRadioBox,
									]}
								>
									<Radio
										label={userDate}
										value={userDate}
										name={machineDate}
										checked={isChecked}
										cssOverrides={
											isChecked
												? checkedRadioLabelColour
												: defaultRadioLabelColour
										}
										onChange={() => setWeeklyDeliveryDate(validDay)}
									/>
								</div>
							);
						})}
				</RadioGroup>
			</Rows>
			<div css={weeklyInfo}>
				<p>
					We will take payment on the date the recipient receives the first
					Guardian Weekly.
				</p>
				<p>
					Subscription start dates are automatically selected to be the earliest
					we can fulfil your order.
				</p>
			</div>
		</>
	);
}
