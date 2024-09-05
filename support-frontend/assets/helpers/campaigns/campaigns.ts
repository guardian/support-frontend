import type { CountryGroupId } from '../internationalisation/countryGroup';
import { UnitedStates } from '../internationalisation/countryGroup';

export type CountdownSetting = {
	label: string;
	countdownStartInMillis: number;
	countdownDeadlineInMillis: number;
};

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
				label: 'Giving Tuesday',
				countdownStartInMillis: Date.parse('Nov 29, 2024 00:00:00'),
				countdownDeadlineInMillis: Date.parse('Dec 04, 2024 00:00:00'),
			},
			{
				label: 'Discount',
				countdownStartInMillis: Date.parse('Dec 09, 2024 00:00:00'),
				countdownDeadlineInMillis: Date.parse('Dec 13, 2024 00:00:00'),
			},
			{
				label: 'Final Countdown',
				countdownStartInMillis: Date.parse('Dec 23, 2024 00:00:00'),
				countdownDeadlineInMillis: Date.parse('Jan 01, 2025 00:00:00'),
			},
			// {
			// 	label: 'testing', // adjust this one as needed
			// 	countdownStartInMillis: Date.parse('Sept 05, 2024 00:00:00'),
			// 	countdownDeadlineInMillis: Date.parse('Sep 06, 2024 00:00:00'),
			// },
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
