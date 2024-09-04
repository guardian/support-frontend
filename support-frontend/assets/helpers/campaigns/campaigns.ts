import type { CountryGroupId } from '../internationalisation/countryGroup';
import { UnitedStates } from '../internationalisation/countryGroup';

export type CountdownSetting = {
	label: string;
	countdownStartInMillis: number;
	countdownDeadlineInMillis: number;
	countdownHideInMillis: number;
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
				label: 'testing',
				countdownStartInMillis: Date.parse('Sept 01, 2024 00:00:00'),
				countdownDeadlineInMillis: Date.parse('Sep 02, 2024 10:15:00'),
				countdownHideInMillis: Date.parse('Sept 02, 2024 10:20:00'),
			},
			{
				label: 'testing 2',
				countdownStartInMillis: Date.parse('Sept 02, 2024 00:00:00'),
				countdownDeadlineInMillis: Date.parse('Sep 04, 2024 16:59:00'),
				countdownHideInMillis: Date.parse('Sept 04, 2024 17:00:00'),
			},
			{
				label: 'testing 3',
				countdownStartInMillis: Date.parse('Sept 05, 2024 00:00:00'),
				countdownDeadlineInMillis: Date.parse('Sep 06, 2024 12:04:00'),
				countdownHideInMillis: Date.parse('Sept 06, 2024 12:05:00'),
			},
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
