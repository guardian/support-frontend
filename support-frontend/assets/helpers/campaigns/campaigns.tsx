import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

export function countdownSwitchOn(): boolean {
	const isOn = isSwitchOn('featureSwitches.enableCampaignCountdown');
	return isOn;
}

interface CampaignCopy {
	headingFragment?: JSX.Element;
	subheading?: JSX.Element;
	oneTimeHeading?: JSX.Element;
	punctuation?: JSX.Element;
}

type CampaignSettings = {
	isEligible: (
		countryGroupId: CountryGroupId,
		promoCode?: string | null,
	) => boolean;
	enableSingleContributions: boolean;
	copy: CampaignCopy;
};

const campaigns: Record<string, CampaignSettings> = {};

const forceCampaign = (campaignId: string): boolean => {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('forceCampaign') === campaignId;
};

export function getCampaignSettings(
	countryGroupId: CountryGroupId,
	promoCode?: string | null,
): CampaignSettings | null {
	for (const campaignId in campaigns) {
		const campaign = campaigns[campaignId];
		if (campaign) {
			const isEligible =
				isCampaignEnabled(campaignId) &&
				campaign.isEligible(countryGroupId, promoCode);
			if (isEligible || forceCampaign(campaignId)) {
				return campaign;
			}
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
