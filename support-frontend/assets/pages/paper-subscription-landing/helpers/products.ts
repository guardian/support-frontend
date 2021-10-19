import type { ProductOptions } from 'helpers/productPrice/productOptions';
import {
	Everyday,
	Sixday,
	SaturdayPlus,
	SundayPlus,
	WeekendPlus,
	SixdayPlus,
	EverydayPlus,
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
