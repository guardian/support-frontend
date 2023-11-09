import type { AmountsTests, ContributionTypes } from 'helpers/contributions';
import 'helpers/contributions';

export type Status = 'On' | 'Off';

export type SwitchObject = Record<string, Status | undefined>;

/**
 * These keys are generated in Switches.scala
 * @see {@link file://./../../../app/admin/settings/Switches.scala}
 *
 * And added to the `window.guardian` object in settingsScript.scala.html
 * @see {@link file://./../../../app/views/settingsScript.scala.html}
 */
type SwitchesKeys =
	| 'oneOffPaymentMethods'
	| 'recurringPaymentMethods'
	| 'subscriptionsPaymentMethods'
	| 'subscriptionsSwitches'
	| 'featureSwitches'
	| 'campaignSwitches'
	| 'recaptchaSwitches';

export type Switches = Record<SwitchesKeys, SwitchObject> & {
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
	amounts?: AmountsTests;
	contributionTypes: ContributionTypes;
	metricUrl: string;
};
