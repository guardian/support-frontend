import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { WeeklyBenefits } from './components/weeklyBenefits';
import { WeeklyCards } from './components/weeklyCards';
import { WeeklyGiftStudentSubs } from './components/weeklyGiftStudentSubs';
import { WeeklyPromotion } from './components/weeklyPromotion';

type WeeklyDigitalLPPropTypes = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	productPrices: ProductPrices | null | undefined;
	orderIsAGift: boolean;
};

export function WeeklyDigitalLP({
	countryId,
	countryGroupId,
	productPrices,
	orderIsAGift,
}: WeeklyDigitalLPPropTypes): JSX.Element {
	console.log(countryId, countryGroupId, productPrices, orderIsAGift);
	return (
		<>
			<WeeklyCards />
			<WeeklyBenefits />
			<WeeklyGiftStudentSubs />
			<WeeklyPromotion />
		</>
	);
}
