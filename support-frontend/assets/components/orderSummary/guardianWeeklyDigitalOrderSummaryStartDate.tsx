interface GuardianWeeklyDigitalOrderSummaryStartDateProps {
	startDate: string;
}
export function GuardianWeeklyDigitalOrderSummaryStartDate({
	startDate,
}: GuardianWeeklyDigitalOrderSummaryStartDateProps): JSX.Element {
	return (
		<p>
			Your first issue of Guardian Weekly will be {startDate}. Please allow 1 to
			7 days after your start date for your magazine to arrive, depending on
			national post services. Your digital benefits will start today.
		</p>
	);
}
