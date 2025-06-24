import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Radio, RadioGroup } from '@guardian/source/react-components';
import Rows from 'components/base/rows';
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

const weeklyInfo = css`
	margin-top: ${space[5]}px;
`;

type WeeklyDeliveryDatesProps = {
	weeklyDeliveryDates: Date[];
	weeklyDeliveryDateSelected: Date;
	setWeeklyDeliveryDate: (deliveryDate: Date) => void;
};

export function WeeklyDeliveryDates({
	weeklyDeliveryDates,
	weeklyDeliveryDateSelected,
	setWeeklyDeliveryDate,
}: WeeklyDeliveryDatesProps) {
	const invalidPublicationDates = ['-12-24', '-12-25', '-12-30'];
	return (
		<>
			<Rows>
				<RadioGroup id="weeklyDeliveryDates" name="weeklyDeliveryDates">
					{weeklyDeliveryDates
						.filter((date) => {
							const machineDate = formatMachineDate(date);
							return !invalidPublicationDates.some((dateSuffix) =>
								machineDate.endsWith(dateSuffix),
							);
						})
						.map((validDate) => {
							const [userDate, machineDate] = [
								formatUserDate(validDate),
								formatMachineDate(validDate),
							];
							const isChecked =
								machineDate === formatMachineDate(weeklyDeliveryDateSelected);
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
										onChange={() => setWeeklyDeliveryDate(validDate)}
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
