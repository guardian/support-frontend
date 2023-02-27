import DatePickerComponent from 'components/datePicker/datePicker';
import { formatMachineDate } from 'helpers/utilities/dateConversions';

export default {
	title: 'Checkouts/Date Picker',
	component: DatePickerComponent,
	argTypes: {
		onChange: { action: 'date changed' },
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					width: '100%',
					maxWidth: '500px',
				}}
			>
				<Story />
			</div>
		),
	],
};

export function DatePicker(args: {
	value: string;
	onChange: (date: string) => void;
}): JSX.Element {
	return <DatePickerComponent value={args.value} onChange={args.onChange} />;
}

DatePicker.args = {
	value: formatMachineDate(new Date()),
};
DatePicker.parameters = {
	// TODO: We can factor out a purely presentational component and then re-enable
	// the snapshot tests. For now the component has hardcoded references to Date.now()
	// so will cause a snapshot diff every day!
	chromatic: { disableSnapshot: true },
};
