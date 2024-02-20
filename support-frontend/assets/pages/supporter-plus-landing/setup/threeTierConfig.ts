import type {
	AmountValuesObject,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

export interface TierBenefits {
	description?: Array<string | { copy: string; strong: boolean }>;
	list: Array<{ copy: string; tooltip?: string }>;
}

export interface TierPlanCosts {
	price: number;
	promoCode?: string;
	discount?: {
		percentage: number;
		price: number;
		duration: { value: number; period: RegularContributionType };
	};
}

interface FrequencyPlans {
	label: string;
	charges: Record<CountryGroupId, TierPlanCosts>;
	priceCards?: Record<CountryGroupId, AmountValuesObject>;
}

interface TierPlans {
	monthly: FrequencyPlans;
	annual: FrequencyPlans;
}

interface TierCard {
	title: string;
	isRecommended?: true;
	benefits: TierBenefits;
	plans: TierPlans;
}

interface TierCards {
	tier1: TierCard;
	tier2: TierCard;
	tier3: TierCard;
}

const tier1: TierCard = {
	title: 'Support',
	benefits: {
		list: [
			{
				copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			},
		],
	},
	plans: {
		monthly: {
			label: 'Monthly',
			charges: {
				GBPCountries: {
					price: 2,
				},
				EURCountries: { price: 2 },
				International: { price: 2 },
				UnitedStates: { price: 2 },
				Canada: { price: 2 },
				NZDCountries: { price: 4 },
				AUDCountries: { price: 4 },
			},
			priceCards: {
				GBPCountries: {
					amounts: [2, 4, 6],
					defaultAmount: 2,
					hideChooseYourAmount: false,
				},
				EURCountries: {
					amounts: [2, 4, 6],
					defaultAmount: 2,
					hideChooseYourAmount: false,
				},
				International: {
					amounts: [2, 5, 10],
					defaultAmount: 2,
					hideChooseYourAmount: false,
				},
				UnitedStates: {
					amounts: [2, 5, 10],
					defaultAmount: 2,
					hideChooseYourAmount: false,
				},
				Canada: {
					amounts: [2, 5, 10],
					defaultAmount: 2,
					hideChooseYourAmount: false,
				},
				NZDCountries: {
					amounts: [4, 10, 15],
					defaultAmount: 4,
					hideChooseYourAmount: false,
				},
				AUDCountries: {
					amounts: [4, 10, 15],
					defaultAmount: 4,
					hideChooseYourAmount: false,
				},
			},
		},
		annual: {
			label: 'Annual',
			charges: {
				GBPCountries: {
					price: 20,
				},
				EURCountries: { price: 20 },
				International: { price: 30 },
				UnitedStates: { price: 30 },
				Canada: { price: 30 },
				NZDCountries: { price: 40 },
				AUDCountries: { price: 40 },
			},
			priceCards: {
				GBPCountries: {
					amounts: [20, 50, 80],
					defaultAmount: 20,
					hideChooseYourAmount: false,
				},
				EURCountries: {
					amounts: [20, 50, 80],
					defaultAmount: 20,
					hideChooseYourAmount: false,
				},
				International: {
					amounts: [30, 60, 90],
					defaultAmount: 30,
					hideChooseYourAmount: false,
				},
				UnitedStates: {
					amounts: [30, 60, 90],
					defaultAmount: 30,
					hideChooseYourAmount: false,
				},
				Canada: {
					amounts: [30, 60, 90],
					defaultAmount: 30,
					hideChooseYourAmount: false,
				},
				NZDCountries: {
					amounts: [40, 80, 120],
					defaultAmount: 40,
					hideChooseYourAmount: false,
				},
				AUDCountries: {
					amounts: [40, 80, 120],
					defaultAmount: 40,
					hideChooseYourAmount: false,
				},
			},
		},
	},
};

const tier2: TierCard = {
	title: 'All-access digital',
	isRecommended: true,
	benefits: {
		list: [
			{
				copy: 'Unlimited access to the Guardian app',
				tooltip: `Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.`,
			},
			{ copy: 'Ad-free reading on all your devices' },
			{
				copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			},
			{
				copy: 'Far fewer asks for support',
				tooltip: `You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.`,
			},
		],
	},
	plans: {
		monthly: {
			label: 'Monthly',
			charges: {
				GBPCountries: {
					price: 10,
				},
				EURCountries: { price: 10 },
				International: { price: 13 },
				UnitedStates: { price: 13 },
				Canada: { price: 13 },
				NZDCountries: { price: 17 },
				AUDCountries: { price: 17 },
			},
		},
		annual: {
			label: 'Annual',
			charges: {
				GBPCountries: {
					price: 95,
				},
				EURCountries: { price: 95 },
				International: { price: 120 },
				UnitedStates: { price: 120 },
				Canada: { price: 120 },
				NZDCountries: { price: 160 },
				AUDCountries: { price: 160 },
			},
		},
	},
};

const tier3: TierCard = {
	title: 'Digital + print',
	benefits: {
		description: [
			'The rewards from ',
			{ strong: true, copy: 'All-access digital' },
		],
		list: [
			{
				copy: 'Guardian Weekly print magazine delivered to your door every week  ',
				tooltip: `Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.`,
			},
		],
	},
	plans: {
		monthly: {
			label: 'Monthly',
			charges: {
				GBPCountries: {
					price: 25,
					promoCode: '3TIER_WEEKLY_UK_MONTHLY',
					discount: {
						percentage: 36,
						price: 16,
						duration: {
							value: 12,
							period: 'MONTHLY',
						},
					},
				},
				EURCountries: {
					price: 36.5,
					promoCode: '3TIER_WEEKLY_EU_MONTHLY',
					discount: {
						percentage: 23.29,
						price: 28,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				International: {
					price: 46,
					promoCode: '3TIER_WEEKLY_INT_MONTHLY',
					discount: {
						percentage: 26.09,
						price: 34,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				UnitedStates: {
					price: 43,
					promoCode: '3TIER_WEEKLY_US_MONTHLY',
					discount: {
						percentage: 18.6,
						price: 35,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				Canada: {
					price: 46,
					promoCode: '3TIER_WEEKLY_CA_MONTHLY',
					discount: {
						percentage: 23.91,
						price: 35,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				NZDCountries: {
					price: 67,
					promoCode: '3TIER_WEEKLY_NZ_MONTHLY',
					discount: {
						percentage: 23.88,
						price: 51,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				AUDCountries: {
					price: 57,
					promoCode: '3TIER_WEEKLY_AU_MONTHLY',
					discount: {
						percentage: 21.05,
						price: 45,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
			},
		},
		annual: {
			label: 'Annual',
			charges: {
				GBPCountries: {
					price: 275,
					promoCode: '3TIER_WEEKLY_UK_ANNUAL',
					discount: {
						percentage: 37.09,
						price: 173,
						duration: {
							value: 1,
							period: 'ANNUAL',
						},
					},
				},
				EURCountries: {
					price: 413,
					promoCode: '3TIER_WEEKLY_EU_ANNUAL',
					discount: {
						percentage: 26.88,
						price: 302,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				International: {
					price: 516,
					promoCode: '3TIER_WEEKLY_INT_ANNUAL',
					discount: {
						percentage: 28.88,
						price: 367,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				UnitedStates: {
					price: 480,
					promoCode: '3TIER_WEEKLY_US_ANNUAL',
					discount: {
						percentage: 21.25,
						price: 378,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				Canada: {
					price: 516,
					promoCode: '3TIER_WEEKLY_CA_ANNUAL',
					discount: {
						percentage: 26.74,
						price: 378,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				NZDCountries: {
					price: 760,
					promoCode: '3TIER_WEEKLY_NZ_ANNUAL',
					discount: {
						percentage: 27.5,
						price: 551,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				AUDCountries: {
					price: 640,
					promoCode: '3TIER_WEEKLY_AU_ANNUAL',
					discount: {
						percentage: 24.06,
						price: 486,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
			},
		},
	},
};

export const tierCards: TierCards = {
	tier1,
	tier2,
	tier3,
};
