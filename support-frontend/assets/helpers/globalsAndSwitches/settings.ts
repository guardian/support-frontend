import type { AmountsTests, ContributionTypes } from 'helpers/contributions';
import 'helpers/contributions';
import type { CheckoutNudgeTest } from './checkoutNudgeSettings';
import type { LandingPageTest } from './landingPageSettings';
import type { SingleCheckoutTest } from './singleCheckoutSettings';

export type Status = 'On' | 'Off';

type SwitchObject = Record<string, Status | undefined>;

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

type Switches = Record<SwitchesKeys, SwitchObject>;

export type Settings = {
	switches: Switches;
	amounts?: AmountsTests;
	contributionTypes: ContributionTypes;
	metricUrl: string;
	landingPageTests?: LandingPageTest[];
	checkoutNudgeTests?: CheckoutNudgeTest[];
	singleCheckoutTests?: SingleCheckoutTest[];
};
