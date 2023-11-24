import type { TickerSettings } from 'components/ticker/types';
import type { ContributionTypes } from 'helpers/contributions';

type CampaignCopy = {
	headerCopy?: string | JSX.Element;
	contributeCopy?: string | JSX.Element;
};

export type CampaignSettings = {
	campaignCode: string;
	campaignPath: string;
	tickerId: string;
	copy?: (goalReached: boolean) => CampaignCopy;
	formMessage?: JSX.Element;
	termsAndConditions?: (
		contributionsTermsLink: string,
		contactEmail: string,
	) => JSX.Element;
	cssModifiers?: string[];
	contributionTypes?: ContributionTypes;
	backgroundImage?: string;
	extraComponent?: JSX.Element;
	tickerSettings: TickerSettings;
	goalReachedCopy?: JSX.Element;
	// If set, the form will be replaced with this if goal reached
};

export const activeCampaigns: Record<string, CampaignSettings> = {
	usEoy2023: {
		campaignCode: 'usEoy2023',
		campaignPath: 'us/contribute',
		tickerId: 'US',
		tickerSettings: {
			countType: 'money',
			endType: 'unlimited',
			headline: 'Help us reach our end-of-year goal',
		},
	},
	ausTicker2023: {
		campaignCode: 'ausTicker2023',
		campaignPath: 'au/contribute',
		tickerId: 'AU',
		tickerSettings: {
			countType: 'money',
			endType: 'unlimited',
			headline: 'Help us reach our end-of-year goal',
		},
	},
};

function campaignEnabledForUser(campaignCode?: string): boolean {
	if (campaignCode && isCampaignEnabled(campaignCode)) {
		const matchingCampaign = activeCampaigns[campaignCode];
		return window.location.pathname.endsWith(
			`/${matchingCampaign.campaignPath}`,
		);
	}

	return false;
}

export function getCampaignSettings(
	campaignCode?: string,
): CampaignSettings | null {
	if (campaignCode && campaignEnabledForUser(campaignCode)) {
		return activeCampaigns[campaignCode];
	}

	return null;
}

export function getCampaignCode(campaignCode?: string): string | null {
	const campaignSettings = getCampaignSettings(campaignCode ?? '');

	if (campaignSettings) {
		return campaignSettings.campaignCode;
	}

	return null;
}

export function isCampaignEnabled(campaignCode: string): boolean {
	const { campaignSwitches } = window.guardian.settings.switches;
	return (
		window.location.hash ===
			`#settings.switches.campaignSwitches.${campaignCode}=On` ||
		campaignSwitches[campaignCode] === 'On'
	);
}
