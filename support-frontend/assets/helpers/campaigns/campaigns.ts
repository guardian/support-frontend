import type {
	TickerData,
	TickerSettings,
} from '@guardian/source-development-kitchen/dist/react-components/ticker/Ticker';
import { fetchJson } from '../async/fetch';
import type { CountryGroupId } from '../internationalisation/countryGroup';
import { UnitedStates } from '../internationalisation/countryGroup';
import { isCodeOrProd } from '../urls/url';

export type CountdownSetting = {
	label: string;
	countdownStartInMillis: number;
	countdownDeadlineInMillis: number;
	// TODO: when design agreed add theme
	//theme: {
	//	backgroundColor: string;
	// 	primaryColor: string;
	//  secondaryColor: string;
	//};
};

export type CampaignSettings = {
	isEligible: (countryGroupId: CountryGroupId) => boolean;
	enableSingleContributions: boolean;
	countdownSettings?: CountdownSetting[];
	tickerSettings: TickerSettings;
};

// Function to fetch ticker data from the correct endpoint
function getTickerUrl(tickerId: string) {
	return isCodeOrProd() ? `/ticker/${tickerId}.json` : '/ticker.json';
}

async function getInitialTickerValues(tickerId: string): Promise<TickerData> {
	const data = await fetchJson<TickerData>(getTickerUrl(tickerId), {});
	const total = Math.floor(data.total);
	const goal = Math.floor(data.goal);
	return {
		total,
		goal,
	};
}

// Campaign settings including ticker configuration
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
		],
		// Ticker settings for the US End of Year 2024 campaign
		tickerSettings: {
			currencySymbol: '$',
			copy: {
				headline: ' ',
			},
			tickerData: await getInitialTickerValues('US.json'),
			tickerStylingSettings: {
				headlineColour: '#000000',
				totalColour: '#64B7C4',
				goalColour: '#FFFFFF',
				filledProgressColour: '#64B7C4',
				progressBarBackgroundColour: 'rgba(100, 183, 196, 0.3)',
			},
			size: 'large',
		},
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
