import type {
	PaperProductOptions,
	ProductOptions,
} from 'helpers/productPrice/productOptions';
import {
	Everyday,
	EverydayPlus,
	SaturdayPlus,
	Sixday,
	SixdayPlus,
	SundayPlus,
	WeekendPlus,
} from 'helpers/productPrice/productOptions';

export const getTitle = (productOption: ProductOptions) => {
	switch (productOption) {
		case Sixday:
			return 'Six day';

		case Everyday:
			return 'Every day';

		case EverydayPlus:
			return 'Every day package and digital subscription';

		case SixdayPlus:
			return 'Six day package and digital subscription';

		case WeekendPlus:
			return 'Weekend package and digital subscription';

		case SaturdayPlus:
			return 'Saturday package and digital subscription';

		case SundayPlus:
			return 'Sunday package and digital subscription';

		default:
			return productOption;
	}
};

export enum Channel {
	Observer = 'observer',
	ObserverAndGuardian = 'gardian_and_observer',
	Guardian = 'guardian',
}

export type LabelProps = {
	text: string;
	channel: Channel;
};
export const getLabel = (productOption: PaperProductOptions): LabelProps => {
	switch (productOption) {
		case 'Sunday':
			return {
				text: 'The Observer',
				channel: Channel.Observer,
			};
		case 'Weekend':
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
