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

export function getCampaignSettings(): CampaignSettings | null {
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
