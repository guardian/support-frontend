import type { TickerSettings } from '@guardian/source-development-kitchen/dist/react-components/ticker/Ticker';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { CountryGroupId } from '../internationalisation/countryGroup';
import {
	AUDCountries,
	GBPCountries,
	UnitedStates,
} from '../internationalisation/countryGroup';

export type CountdownSetting = {
	label: string;
	countdownStartInMillis: number;
	countdownDeadlineInMillis: number;
	theme: {
		backgroundColor: string;
		foregroundColor: string;
	};
};

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

export type CampaignTickerSettings = Omit<TickerSettings, 'tickerData'> & {
	id: string;
};

export type CampaignSettings = {
	isEligible: (
		countryGroupId: CountryGroupId,
		promoCode?: string | null,
	) => boolean;
	enableSingleContributions: boolean;
	countdownSettings?: CountdownSetting[];
	copy: CampaignCopy;
	tickerSettings?: CampaignTickerSettings;
};

const campaigns: Record<string, CampaignSettings> = {
	usEoy2024: {
		isEligible: (countryGroupId: CountryGroupId) =>
			countryGroupId === UnitedStates,
		enableSingleContributions: false,
		countdownSettings: [
			{
				label: 'This Giving Tuesday, give to the Guardian',
				countdownStartInMillis: Date.parse('Nov 27, 2024 00:01:00'),
				countdownDeadlineInMillis: Date.parse('Dec 03, 2024 23:59:59'),
				theme: {
					backgroundColor: '#ab0613',
					foregroundColor: '#ffffff',
				},
			},
			{
				label: "It's not too late to give to the Guardian",
				countdownStartInMillis: Date.parse('Dec 04, 2024 00:01:00'),
				countdownDeadlineInMillis: Date.parse('Dec 05, 2024 00:01:00'),
				theme: {
					backgroundColor: '#ab0613',
					foregroundColor: '#ffffff',
				},
			},
			{
				label: 'Last chance to support us this year',
				countdownStartInMillis: Date.parse('Dec 23, 2024 00:00:00'),
				countdownDeadlineInMillis: Date.parse('Jan 01, 2025 00:00:00'),
				theme: {
					backgroundColor: '#ab0613',
					foregroundColor: '#ffffff',
				},
			},
		],
		copy: {
			headingFragment: <>Protect </>,
			subheading: (
				<>
					We're not owned by a billionaire or shareholders: our fiercely independent journalism is funded by our readers. Monthly giving makes the most impact. <strong>You can cancel anytime.</strong>
				</>
			),
			oneTimeHeading: <>Choose your gift amount</>,
		},
		tickerSettings: {
			currencySymbol: '$',
			copy: {},
			tickerStylingSettings: {
				headlineColour: '#ffffff',
				totalColour: '#ffffff',
				goalColour: '#ffffff',
				filledProgressColour: '#ffffff',
				progressBarBackgroundColour: 'rgba(250, 250, 250, 0.3)',
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
	ukBlackFriday2024: {
		isEligible: (countryGroupId: CountryGroupId, promoCode?: string | null) =>
			countryGroupId === GBPCountries &&
			promoCode === 'BLACK_FRIDAY_DISCOUNT_2024',
		enableSingleContributions: false,
		countdownSettings: [
			{
				label: 'Last chance to claim your Black Friday offer',
				countdownStartInMillis: Date.parse('Nov 29, 2024 00:00:00'),
				countdownDeadlineInMillis: Date.parse('Dec 02, 2024 23:59:59'),
				theme: {
					backgroundColor: '#1e3e72',
					foregroundColor: '#ffffff',
				},
			},
		],
		copy: {
			headingFragment: <>This Black Friday, why not support </>,
			subheading: (
				<>
					We're not owned by a billionaire or shareholders - our readers support
					us. Choose to join with one of the options below.
					<strong>Cancel anytime.</strong>
				</>
			),
			oneTimeHeading: <>Choose your gift amount</>,
			punctuation: <>?</>,
		},
	},
};

const forceCampaign = (campaignId: string): boolean => {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('forceCampaign') === campaignId;
};

export function getCampaignSettings(
	countryGroupId: CountryGroupId,
	promoCode?: string | null,
): CampaignSettings | null {
	for (const campaignId in campaigns) {
		const isEligible =
			isCampaignEnabled(campaignId) &&
			campaigns[campaignId].isEligible(countryGroupId, promoCode);
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
