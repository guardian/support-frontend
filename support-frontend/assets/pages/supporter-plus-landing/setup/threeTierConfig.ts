import type {
	AmountValuesObject,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	supporterPlusWithGuardianWeeklyAnnualPromosV2,
	supporterPlusWithGuardianWeeklyMonthlyPromosV2,
	supporterPlusWithGuardianWeeklyV2,
} from 'helpers/productCatalog';

export interface TierBenefits {
	description?: Array<string | { copy: string; strong: boolean }>;
	list: Array<{
		copy: string | JSX.Element;
		tooltip?: string;
		strong?: boolean;
	}>;
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

export interface TierPlans {
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

const tier3V2: TierCard = {
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
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans
							.MonthlyWithGuardianWeekly.pricing.GBP,
					promoCode: '3TIER_WEEKLY_UK_MONTHLY_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.GBPCountries
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.GBPCountries
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyMonthlyPromosV2.GBPCountries
									.discount.durationMonths,
							period: 'MONTHLY',
						},
					},
				},
				EURCountries: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans
							.MonthlyWithGuardianWeekly.pricing.EUR,
					promoCode: '3TIER_WEEKLY_EU_MONTHLY_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.EURCountries
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.EURCountries
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyMonthlyPromosV2.EURCountries
									.discount.durationMonths,
							period: 'MONTHLY',
						},
					},
				},
				International: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans
							.MonthlyWithGuardianWeeklyInt.pricing.USD,
					promoCode: '3TIER_WEEKLY_INT_MONTHLY_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.International
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.International
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyMonthlyPromosV2.International
									.discount.durationMonths,
							period: 'MONTHLY',
						},
					},
				},
				UnitedStates: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans
							.MonthlyWithGuardianWeekly.pricing.USD,
					promoCode: '3TIER_WEEKLY_US_MONTHLY_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.UnitedStates
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.UnitedStates
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyMonthlyPromosV2.UnitedStates
									.discount.durationMonths,
							period: 'MONTHLY',
						},
					},
				},
				Canada: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans
							.MonthlyWithGuardianWeekly.pricing.CAD,
					promoCode: '3TIER_WEEKLY_CA_MONTHLY_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.Canada.discount
								.amount,
						price:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.Canada
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyMonthlyPromosV2.Canada.discount
									.durationMonths,
							period: 'MONTHLY',
						},
					},
				},
				NZDCountries: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans
							.MonthlyWithGuardianWeekly.pricing.NZD,
					promoCode: '3TIER_WEEKLY_NZ_MONTHLY_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.NZDCountries
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.NZDCountries
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyMonthlyPromosV2.NZDCountries
									.discount.durationMonths,
							period: 'MONTHLY',
						},
					},
				},
				AUDCountries: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans
							.MonthlyWithGuardianWeekly.pricing.AUD,
					promoCode: '3TIER_WEEKLY_AU_MONTHLY_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.AUDCountries
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyMonthlyPromosV2.AUDCountries
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyMonthlyPromosV2.AUDCountries
									.discount.durationMonths,
							period: 'MONTHLY',
						},
					},
				},
			},
		},
		annual: {
			label: 'Annual',
			charges: {
				GBPCountries: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans.AnnualWithGuardianWeekly
							.pricing.GBP,
					promoCode: '3TIER_WEEKLY_UK_ANNUAL_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.GBPCountries
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.GBPCountries
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyAnnualPromosV2.GBPCountries
									.discount.durationMonths,
							period: 'ANNUAL',
						},
					},
				},
				EURCountries: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans.AnnualWithGuardianWeekly
							.pricing.EUR,
					promoCode: '3TIER_WEEKLY_EU_ANNUAL_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.EURCountries
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.EURCountries
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyAnnualPromosV2.EURCountries
									.discount.durationMonths,
							period: 'ANNUAL',
						},
					},
				},
				International: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans
							.AnnualWithGuardianWeeklyInt.pricing.USD,
					promoCode: '3TIER_WEEKLY_INT_ANNUAL_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.International
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.International
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyAnnualPromosV2.International
									.discount.durationMonths,
							period: 'ANNUAL',
						},
					},
				},
				UnitedStates: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans.AnnualWithGuardianWeekly
							.pricing.USD,
					promoCode: '3TIER_WEEKLY_US_ANNUAL_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.UnitedStates
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.UnitedStates
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyAnnualPromosV2.UnitedStates
									.discount.durationMonths,
							period: 'ANNUAL',
						},
					},
				},
				Canada: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans.AnnualWithGuardianWeekly
							.pricing.CAD,
					promoCode: '3TIER_WEEKLY_CA_ANNUAL_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.Canada.discount
								.amount,
						price:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.Canada
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyAnnualPromosV2.Canada.discount
									.durationMonths,
							period: 'ANNUAL',
						},
					},
				},
				NZDCountries: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans.AnnualWithGuardianWeekly
							.pricing.NZD,
					promoCode: '3TIER_WEEKLY_NZ_ANNUAL_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.NZDCountries
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.NZDCountries
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyAnnualPromosV2.NZDCountries
									.discount.durationMonths,
							period: 'ANNUAL',
						},
					},
				},
				AUDCountries: {
					price:
						supporterPlusWithGuardianWeeklyV2.ratePlans.AnnualWithGuardianWeekly
							.pricing.AUD,
					promoCode: '3TIER_WEEKLY_AU_ANNUAL_V2',
					discount: {
						percentage:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.AUDCountries
								.discount.amount,
						price:
							supporterPlusWithGuardianWeeklyAnnualPromosV2.AUDCountries
								.discountedPrice,
						duration: {
							value:
								supporterPlusWithGuardianWeeklyAnnualPromosV2.AUDCountries
									.discount.durationMonths,
							period: 'ANNUAL',
						},
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

export const tierCardsV2: TierCards = {
	tier1,
	tier2,
	tier3: tier3V2,
};
