import type { RegularContributionType } from 'helpers/contributions';
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
			{ copy: 'Regular supporter newsletter from inside our newsroom' },
			{ copy: 'See far fewer asks for support' },
		],
	},
	plans: {
		monthly: {
			label: 'Monthly',
			charges: {
				GBPCountries: {
					price: 4,
				},
				UnitedStates: { price: 4 },
				AUDCountries: { price: 4 },
				EURCountries: { price: 4 },
				NZDCountries: { price: 4 },
				Canada: { price: 4 },
				International: { price: 4 },
			},
		},
		annual: {
			label: 'Annual',
			charges: {
				GBPCountries: {
					price: 400,
				},
				UnitedStates: { price: 400 },
				AUDCountries: { price: 400 },
				EURCountries: { price: 400 },
				NZDCountries: { price: 400 },
				Canada: { price: 400 },
				International: { price: 400 },
			},
		},
	},
};

const tier2: TierCard = {
	title: 'All access digital',
	isRecommended: true,
	benefits: {
		list: [
			{
				copy: 'Full access to the Guardian News app',
				tooltip:
					'With offline reading and personalised recommendations, never miss a story with the Guardian News app – a beautiful, intuitive reading experience that you can access anywhere',
			},
			{ copy: 'Ad-free reading on all your digital devices' },
			{
				copy: 'Regular supporter newsletter from inside our newsroom',
			},
			{ copy: 'See far fewer asks for support' },
		],
	},
	plans: {
		monthly: {
			label: 'Monthly',
			charges: {
				GBPCountries: {
					price: 10,
				},
				UnitedStates: { price: 10 },
				AUDCountries: { price: 10 },
				EURCountries: { price: 10 },
				NZDCountries: { price: 10 },
				Canada: { price: 10 },
				International: { price: 10 },
			},
		},
		annual: {
			label: 'Annual',
			charges: {
				GBPCountries: {
					price: 1000,
				},
				UnitedStates: { price: 1000 },
				AUDCountries: { price: 1000 },
				EURCountries: { price: 1000 },
				NZDCountries: { price: 1000 },
				Canada: { price: 1000 },
				International: { price: 1000 },
			},
		},
	},
};

const tier3: TierCard = {
	title: 'Digital + print',
	benefits: {
		description: [
			'All features of ',
			{ strong: true, copy: 'All access digital' },
		],
		list: [
			{
				copy: 'Guardian Weekly magazine delivered to your door every week',
				tooltip:
					'Guardian Weekly is a handpicked selection of in-depth articles, global news, long reads, opinion and more. In a beautifully concise magazine, it is delivered to you every every, wherever you are in the world.',
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
						percentage: 64,
						price: 16,
						duration: {
							value: 12,
							period: 'MONTHLY',
						},
					},
				},
				UnitedStates: {
					price: 25,
					promoCode: '3TIER_WEEKLY_US_MONTHLY',
					discount: {
						percentage: 64,
						price: 16,
						duration: { value: 6, period: 'MONTHLY' },
					},
				},
				AUDCountries: {
					price: 25,
					promoCode: '3TIER_WEEKLY_AU_MONTHLY',
					discount: {
						percentage: 64,
						price: 16,
						duration: { value: 6, period: 'MONTHLY' },
					},
				},
				EURCountries: {
					price: 25,
					promoCode: '3TIER_WEEKLY_EU_MONTHLY',
					discount: {
						percentage: 64,
						price: 16,
						duration: { value: 6, period: 'MONTHLY' },
					},
				},
				NZDCountries: {
					price: 25,
					promoCode: '3TIER_WEEKLY_NZ_MONTHLY',
					discount: {
						percentage: 64,
						price: 16,
						duration: { value: 6, period: 'MONTHLY' },
					},
				},
				Canada: {
					price: 25,
					promoCode: '3TIER_WEEKLY_CA_MONTHLY',
					discount: {
						percentage: 64,
						price: 16,
						duration: { value: 6, period: 'MONTHLY' },
					},
				},
				International: {
					price: 25,
					promoCode: '3TIER_WEEKLY_INT_MONTHLY',
					discount: {
						percentage: 64,
						price: 16,
						duration: { value: 6, period: 'MONTHLY' },
					},
				},
			},
		},
		annual: {
			label: 'Annual',
			charges: {
				GBPCountries: {
					price: 2500,
					promoCode: '3TIER_WEEKLY_UK_ANNUAL',
					discount: {
						percentage: 64,
						price: 1600,
						duration: {
							value: 1,
							period: 'ANNUAL',
						},
					},
				},
				UnitedStates: {
					price: 2500,
					promoCode: '3TIER_WEEKLY_US_ANNUAL',
					discount: {
						percentage: 64,
						price: 1600,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				AUDCountries: {
					price: 2500,
					promoCode: '3TIER_WEEKLY_AU_ANNUAL',
					discount: {
						percentage: 64,
						price: 1600,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				EURCountries: {
					price: 2500,
					promoCode: '3TIER_WEEKLY_EU_ANNUAL',
					discount: {
						percentage: 64,
						price: 1600,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				NZDCountries: {
					price: 2500,
					promoCode: '3TIER_WEEKLY_NZ_ANNUAL',
					discount: {
						percentage: 64,
						price: 1600,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				Canada: {
					price: 2500,
					promoCode: '3TIER_WEEKLY_CA_ANNUAL',
					discount: {
						percentage: 64,
						price: 1600,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				International: {
					price: 2500,
					promoCode: '3TIER_WEEKLY_INT_ANNUAL',
					discount: {
						percentage: 64,
						price: 1600,
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
