import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Radio, RadioGroup } from '@guardian/source/react-components';
import Rows from 'components/base/rows';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import {
	checkedRadioBox,
	checkedRadioLabelColour,
	defaultRadioBox,
	defaultRadioLabelColour,
	radioPadding,
} from 'pages/[countryGroupId]/components/paymentMethod';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';

const weeklyInfo = css`
	margin-top: ${space[5]}px;
`;

type WeeklyDeliveryDatesProps = {
	legend: string;
	weeklyDeliveryDates: Date[];
	weeklyDeliveryDate: Date;
	setWeeklyDeliveryDate: (deliveryDate: Date) => void;
};

function deliveryDateIsInvalid(date: Date): boolean {
	const invalidPublicationDates = ['-12-24', '-12-25', '-12-30'];
	const machineDate = formatMachineDate(date);
	return invalidPublicationDates.some((dateSuffix) =>
		machineDate.endsWith(dateSuffix),
	);
}

export function WeeklyDeliveryDates({
	legend,
	weeklyDeliveryDates,
	weeklyDeliveryDate,
	setWeeklyDeliveryDate,
}: WeeklyDeliveryDatesProps) {
	return (
		<>
			<FormSection>
				<Legend>{legend}</Legend>
				<Rows>
					<RadioGroup id="weeklyDeliveryDates" name="weeklyDeliveryDates">
						{weeklyDeliveryDates
							.filter((date) => {
								return !deliveryDateIsInvalid(date);
							})
							.map((validDate) => {
								const [userDate, machineDate] = [
									formatUserDate(validDate),
									formatMachineDate(validDate),
								];
								const isChecked =
									machineDate === formatMachineDate(weeklyDeliveryDate);
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
						We will take payment on the first issue date of the Guardian Weekly
						that the recipient is due to receive.
					</p>
					<p>
						Subscription start dates are automatically selected to be the
						earliest we can fulfil your order.
					</p>
				</div>
			</FormSection>
			<CheckoutDivider spacing="loose" />
		</>
	);
}
