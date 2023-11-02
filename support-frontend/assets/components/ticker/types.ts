import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

export type TickerCountType = 'money' | 'people';

export type TickerEndType = 'unlimited' | 'hardstop';

export type TickerCopy = {
	countLabel: string;
	goalReachedPrimary: string;
	goalReachedSecondary: string;
};

export type TickerConfigData = {
	total: number;
	goal: number;
};

export type TickerSettings = {
	countType: TickerCountType;
	endType: TickerEndType;
	countryGroup: CountryGroupId;
	currencySymbol: string;
	headline: string;
};
