import type {
	ConfiguredAmounts,
	ContributionTypes,
} from 'helpers/contributions';
import 'helpers/contributions';

export type Status = 'On' | 'Off';

export type SwitchObject = Record<string, Status>;

export type Switches = Record<string, SwitchObject> & {
	experiments: Record<
		string,
		{
			name: string;
			description: string;
			state: Status;
		}
	>;
};

export type Settings = {
	switches: Switches;
	amounts?: ConfiguredAmounts;
	contributionTypes: ContributionTypes;
	metricUrl: string;
};
