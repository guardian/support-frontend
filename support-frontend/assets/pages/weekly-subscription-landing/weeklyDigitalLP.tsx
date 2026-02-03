import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import {
	getCountryGroup,
	type ProductPrices,
} from 'helpers/productPrice/productPrices';
import { WeeklyBenefits } from './components/weeklyBenefits';
import { WeeklyCards } from './components/weeklyCards';
import { WeeklyGiftStudentSubs } from './components/weeklyGiftStudentSubs';
import { WeeklyPriceInfo } from './components/weeklyPriceInfo';

type WeeklyDigitalLPPropTypes = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	productPrices: ProductPrices;
	orderIsAGift: boolean;
};

export function WeeklyDigitalLP({
	countryId,
	countryGroupId,
	productPrices,
	orderIsAGift,
}: WeeklyDigitalLPPropTypes): JSX.Element {
	console.log(countryId, countryGroupId, productPrices, orderIsAGift);
	const countryGroup = getCountryGroup(countryId);
	const productPrice =
		productPrices[countryGroup.name]?.Domestic?.NoProductOptions?.Annual?.[
			countryGroup.currency
		];
	const sampleWeeklyCardsCopy = `PRICE CARDS COMPONENT Annual=>${productPrice?.currency}${productPrice?.price}`;
	return (
		<>
			<FullWidthContainer theme="brand">
				<CentredContainer>
					<WeeklyCards sampleCopy={sampleWeeklyCardsCopy} />
					<WeeklyBenefits sampleCopy="WEEKLY BENEFITS COMPONENT" />
					<WeeklyPriceInfo />
				</CentredContainer>
			</FullWidthContainer>
			<WeeklyGiftStudentSubs
				countryGroupId={countryGroupId}
				orderIsAGift={orderIsAGift}
			/>
		</>
	);
}
