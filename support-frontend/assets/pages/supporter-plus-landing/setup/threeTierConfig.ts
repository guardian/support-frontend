import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

export interface TierBenefits {
	description?: Array<string | { copy: string; strong: boolean }>;
	list: Array<{ copy: string; tooltip?: string }>;
}

export interface TierPlanCosts {
	price: number;
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
				EURCountries: { price: 4 },
				International: { price: 5 },
				UnitedStates: { price: 5 },
				Canada: { price: 5 },
				NZDCountries: { price: 10 },
				AUDCountries: { price: 10 },
			},
		},
		annual: {
			label: 'Annual',
			charges: {
				GBPCountries: {
					price: 50,
				},
				EURCountries: { price: 50 },
				International: { price: 60 },
				UnitedStates: { price: 60 },
				Canada: { price: 60 },
				NZDCountries: { price: 80 },
				AUDCountries: { price: 80 },
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
					discount: {
						percentage: 23.29,
						price: 28,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				International: {
					price: 49,
					discount: {
						percentage: 26.09,
						price: 34,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				UnitedStates: {
					price: 43,
					discount: {
						percentage: 18.6,
						price: 35,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				Canada: {
					price: 46,
					discount: {
						percentage: 23.91,
						price: 35,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				NZDCountries: {
					price: 67,
					discount: {
						percentage: 23.88,
						price: 51,
						duration: { value: 12, period: 'MONTHLY' },
					},
				},
				AUDCountries: {
					price: 57,
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
					discount: {
						percentage: 26.88,
						price: 302,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				International: {
					price: 516,
					discount: {
						percentage: 28.88,
						price: 367,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				UnitedStates: {
					price: 480,
					discount: {
						percentage: 21.25,
						price: 378,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				Canada: {
					price: 516,
					discount: {
						percentage: 26.74,
						price: 378,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				NZDCountries: {
					price: 760,
					discount: {
						percentage: 27.5,
						price: 551,
						duration: { value: 1, period: 'ANNUAL' },
					},
				},
				AUDCountries: {
					price: 640,
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
