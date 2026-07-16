import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';

export const baseHomeDeliveryPromotion = {
	name: 'Home delivery promo',
	promoCode: 'PROMO10',
	description: '10% off',
	isIntroductoryPricing: false,
};

export const baseCollectionPromotion = {
	name: 'Collection promo',
	promoCode: 'PROMO20',
	description: '20% off',
	isIntroductoryPricing: false,
};

const baseProductOption: Omit<ProductPrice, 'promotions'> = {
	price: 9.99,
	currency: 'GBP',
	fixedTerm: false,
};

export const productPrices: ProductPrices = {
	'United Kingdom': {
		HomeDelivery: {
			EverydayPlus: {
				Monthly: {
					GBP: {
						...baseProductOption,
						promotions: [baseHomeDeliveryPromotion],
					},
				},
			},
			WeekendPlus: {
				Monthly: {
					GBP: {
						...baseProductOption,
						promotions: [baseHomeDeliveryPromotion],
					},
				},
			},
			SaturdayPlus: {
				Monthly: {
					GBP: {
						...baseProductOption,
						promotions: [
							{
								name: 'First promo',
								promoCode: 'FIRST',
								description: 'First promo',
								isIntroductoryPricing: false,
							},
							baseHomeDeliveryPromotion,
						],
					},
				},
			},
			SixdayPlus: {
				Monthly: {
					GBP: {
						...baseProductOption,
						promotions: [],
					},
				},
			},
		},

		Collection: {
			EverydayPlus: {
				Monthly: {
					GBP: {
						...baseProductOption,
						promotions: [baseCollectionPromotion],
					},
				},
			},
		},
	},
};
