import type { TickerSettings } from '@guardian/source-development-kitchen/dist/react-components/ticker/Ticker';
import type { CountryGroupId } from '../internationalisation/countryGroup';
import {
	AUDCountries,
	UnitedStates,
} from '../internationalisation/countryGroup';

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

interface CampaignCopy {
	headingFragment?: JSX.Element;
	subheading?: JSX.Element;
	oneTimeHeading?: JSX.Element;
}

export type CampaignTickerSettings = Omit<TickerSettings, 'tickerData'> & {
	id: string;
};

export type CampaignSettings = {
	isEligible: (countryGroupId: CountryGroupId) => boolean;
	enableSingleContributions: boolean;
	countdownSettings?: CountdownSetting[];
	copy: CampaignCopy;
	tickerSettings: CampaignTickerSettings;
};

const campaigns: Record<string, CampaignSettings> = {
	usEoy2024: {
		isEligible: (countryGroupId: CountryGroupId) =>
			countryGroupId === UnitedStates,
		enableSingleContributions: false,
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
		copy: {
			headingFragment: <>Protect </>,
			subheading: (
				<>
					We're not owned by a billionaire or shareholders - our readers support
					us. Can you help us reach our goal? Monthly giving is most valuable to
					us. <strong>You can cancel anytime.</strong>
				</>
			),
			oneTimeHeading: <>Choose your gift amount</>,
		},
		tickerSettings: {
			currencySymbol: '$',
			copy: {},
			tickerStylingSettings: {
				headlineColour: '#000000',
				totalColour: '#64B7C4',
				goalColour: '#FFFFFF',
				filledProgressColour: '#64B7C4',
				progressBarBackgroundColour: 'rgba(100, 183, 196, 0.3)',
			},
			size: 'large',
			id: 'US',
		},
	},
	ausEoy2024: {
		isEligible: (countryGroupId: CountryGroupId) =>
			countryGroupId === AUDCountries,
		enableSingleContributions: false,
		countdownSettings: [],
		copy: {
			headingFragment: <>Support </>,
			subheading: (
				<>
					We're not owned by a billionaire or shareholders - our readers support
					us. Choose to join with one of the options below.
					<strong>Cancel anytime.</strong>
				</>
			),
			oneTimeHeading: <>Choose your gift amount</>,
		},
		tickerSettings: {
			currencySymbol: '$',
			copy: {},
			tickerStylingSettings: {
				headlineColour: '#000000',
				totalColour: '#FBBCC7',
				goalColour: '#FFFFFF',
				filledProgressColour: '#FBBCC7',
				progressBarBackgroundColour: 'rgba(100, 183, 196, 0.3)',
			},
			size: 'large',
			id: 'AU',
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
