import type { TickerSettings } from 'components/ticker/contributionTicker';
import type { ContributionTypes } from 'helpers/contributions';

type CampaignCopy = {
	headerCopy?: string | JSX.Element;
	contributeCopy?: string | JSX.Element;
};

export type CampaignSettings = {
	campaignCode: string;
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
	tickerSettings?: TickerSettings;
	goalReachedCopy?: JSX.Element;
	// If set, the form will be replaced with this if goal reached
	createReferralCodes: boolean;
};

const currentCampaignPath: string | null = 'au/contribute';

const aus2021Copy = (): CampaignCopy => ({
	headerCopy: 'Support Guardian Australia with a contribution of any size',
	contributeCopy:
		'Together, we can be a voice for change. Help us reach our ambitious goal of 170,000 supporters.',
});

export const campaign: CampaignSettings = {
	campaignCode: 'Aus_moment_2021',
	copy: aus2021Copy,
	tickerSettings: {
		tickerCountType: 'people',
		tickerEndType: 'unlimited',
		currencySymbol: '$',
		copy: {
			countLabel: 'supporters in Australia',
			goalReachedPrimary: "We've hit our goal!",
			goalReachedSecondary: 'but you can still support us',
		},
	},
	createReferralCodes: false,
};

function campaignEnabledForUser(
	campaignCode: string | null | undefined,
): boolean {
	if (currentCampaignPath && window.guardian.enableContributionsCampaign) {
		return (
			window.guardian.forceContributionsCampaign ||
			window.location.pathname.endsWith(`/${currentCampaignPath}`) ||
			campaign.campaignCode === campaignCode
		);
	}

	return false;
}

export function getCampaignSettings(
	campaignCode?: string,
): CampaignSettings | null {
	if (campaignEnabledForUser(campaignCode)) {
		return campaign;
	}

	return null;
}
export function getCampaignCode(campaignCode?: string): string | null {
	const campaignSettings = getCampaignSettings(campaignCode);

	if (campaignSettings) {
		return campaignSettings.campaignCode;
	}

	return null;
}
