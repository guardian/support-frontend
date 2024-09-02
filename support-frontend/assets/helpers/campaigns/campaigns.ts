import type { CountryGroupId } from '../internationalisation/countryGroup';
import { UnitedStates } from '../internationalisation/countryGroup';

export type CountdownSetting = {
	label: string;
	countdownStartInMillis: number;
	countdownDeadlineInMillis: number;
	countdownHideInMillis: number;
}

export type CampaignSettings = {
	isEligible: (countryGroupId: CountryGroupId) => boolean;
	enableSingleContributions: boolean;
	countdownSettings: CountdownSetting[];
};

const campaigns: Record<string, CampaignSettings> = {
	usEoy2024: {
		isEligible: (countryGroupId: CountryGroupId) =>
			countryGroupId === UnitedStates,
		enableSingleContributions: true,
		countdownSettings: [
			{
				label: 'testing',
				countdownStartInMillis: Date.parse('Aug 28, 2024 17:30:00'), 
				countdownDeadlineInMillis: Date.parse('Sep 03, 2024 17:45:00'), 
				countdownHideInMillis: Date.parse('Sept 04, 2024 17:50:00'), 
			}
		],
	},
};

const forceCampaign = (campaignId: string): boolean => {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('forceCampaign') === campaignId;
};

export function getCampaignSettings(
	countryGroupId: CountryGroupId,
): CampaignSettings | null {
	for (const campaignId in campaigns) {
		const isEligible =
			isCampaignEnabled(campaignId) &&
			campaigns[campaignId].isEligible(countryGroupId);
		if (isEligible || forceCampaign(campaignId)) {
			return campaigns[campaignId];
		}
	}
	return null;
}

function isCampaignEnabled(campaignId: string): boolean {
	const { campaignSwitches } = window.guardian.settings.switches;
	return (
		window.location.hash ===
			`#settings.switches.campaignSwitches.${campaignId}=On` ||
		campaignSwitches[campaignId] === 'On'
	);
}
