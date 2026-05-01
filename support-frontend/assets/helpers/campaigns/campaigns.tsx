import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

export function countdownSwitchOn(): boolean {
	const isOn = isSwitchOn('featureSwitches.enableCampaignCountdown');
	return isOn;
}
