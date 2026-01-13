import type { ProductPrices } from 'helpers/productPrice/productPrices';

export const baseHomeDeliveryPromotion = {
	promoCode: 'PROMO10',
	description: '10% off',
};

export const baseCollectionPromotion = {
	promoCode: 'PROMO20',
	description: '20% off',
};

const baseProductOption = {
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
						promotions: [baseHomeDeliveryPromotion],
						...baseProductOption,
					},
				},
			},
			WeekendPlus: {
				Monthly: {
					GBP: {
						promotions: [baseHomeDeliveryPromotion],
					},
				},
			},
			SaturdayPlus: {
				Monthly: {
					GBP: {
						promotions: [
							{
								promoCode: 'FIRST',
								description: 'First promo',
							},
							baseHomeDeliveryPromotion,
						],
					},
				},
			},
			SixdayPlus: {
				Monthly: {
					GBP: {
						promotions: [],
					},
				},
			},
		},

		Collection: {
			EverydayPlus: {
				Monthly: {
					GBP: {
						promotions: [baseCollectionPromotion],
					},
				},
			},
		},
	},
};
