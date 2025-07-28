import type {
	PaperProductOptions,
	ProductOptions,
} from '@modules/product/productOptions';
import {
	Everyday,
	EverydayPlus,
	SaturdayPlus,
	Sixday,
	SixdayPlus,
	WeekendPlus,
} from '@modules/product/productOptions';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

export const getPaperDescription = (
	productKey: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
): string | undefined => {
	switch (productKey) {
		case 'HomeDelivery':
		case 'NationalDelivery':
		case 'SubscriptionCard':
			return getTitle(ratePlan as ProductOptions);
		default:
			return undefined;
	}
};

export const getTitle = (productOption: ProductOptions) => {
	switch (productOption) {
		case Sixday:
			return 'Six day';

		case Everyday:
			return 'Every day';

		case EverydayPlus:
			return 'Every day';

		case SixdayPlus:
			return 'Six day';

		case WeekendPlus:
			return 'Weekend';

		case SaturdayPlus:
			return 'Saturday';

		default:
			return productOption;
	}
};

export enum Channel {
	Observer = 'observer',
	ObserverAndGuardian = 'gardian_and_observer',
	Guardian = 'guardian',
}
export enum ObserverPrint {
	Paper = 'ObserverPaper',
	SubscriptionCard = 'ObserverSubscriptionCard',
}

export type ProductLabelProps = {
	text: string;
	channel: Channel;
};
export const getProductLabel = (
	productOption: PaperProductOptions,
): ProductLabelProps => {
	switch (productOption) {
		case 'Sunday':
			return {
				text: 'The Observer',
				channel: Channel.Observer,
			};
		case 'WeekendPlus':
		case 'Weekend':
		case 'EverydayPlus':
		case 'Everyday':
			return {
				text: 'The Guardian + the Observer',
				channel: Channel.ObserverAndGuardian,
			};
		default:
			return {
				text: 'The Guardian',
				channel: Channel.Guardian,
			};
	}
};
