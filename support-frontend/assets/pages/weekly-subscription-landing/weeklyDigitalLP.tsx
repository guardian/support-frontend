import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import {
	getCountryGroup,
	type ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { WeeklyBenefits } from './components/weeklyBenefits';
import { WeeklyCards } from './components/weeklyCards';
import { WeeklyDigitalHero } from './components/weeklyDigitalHero';
import { WeeklyGiftStudentSubs } from './components/weeklyGiftStudentSubs';
import { WeeklyPriceInfo } from './components/weeklyPriceInfo';

type WeeklyDigitalLPProps = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	productPrices: ProductPrices;
	orderIsAGift: boolean;
	promotionCopy?: PromotionCopy;
};
export function WeeklyDigitalLP({
	countryId,
	countryGroupId,
	productPrices,
	orderIsAGift,
	promotionCopy,
}: WeeklyDigitalLPProps): JSX.Element {
	const sanitisedPromoCopy = getPromotionCopy(promotionCopy, orderIsAGift);
	const countryGroup = getCountryGroup(countryId);
	const productPrice =
		productPrices[countryGroup.name]?.Domestic?.NoProductOptions?.Annual?.[
			countryGroup.currency
		];
	const sampleWeeklyCardsCopy = `PRICE CARDS COMPONENT Annual=>${productPrice?.currency}${productPrice?.price}`;
	return (
		<>
			<WeeklyDigitalHero
				orderIsAGift={orderIsAGift}
				promotionCopy={sanitisedPromoCopy}
				countryGroupId={countryGroupId}
			/>
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
