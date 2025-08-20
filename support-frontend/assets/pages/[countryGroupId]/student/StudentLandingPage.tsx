import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import {
	Canada,
	GBPCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ratePlanToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { AccordionFAQ } from '../components/accordionFAQ';
import StudentHeader from './components/StudentHeader';
import { StudentTsAndCs } from './components/studentTsAndCs';
import { getStudentDiscount } from './helpers/discountDetails';
import { getStudentFAQs } from './helpers/studentFAQs';
import { getStudentTsAndCs } from './helpers/studentTsAndCsCopy';

export function StudentLandingPage({
	geoId,
	productKey,
	ratePlanKey,
	landingPageVariant,
}: {
	geoId: GeoId;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	landingPageVariant: LandingPageVariant;
}) {
	const faqItems = getStudentFAQs(geoId);
	const tsAndCsItem = getStudentTsAndCs(geoId);

	const { countryGroupId } = getGeoIdConfig(geoId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries, UnitedStates, Canada],
		selectedCountryGroup: countryGroupId,
		subPath: '/student',
	};
	const showCountrySwitcher =
		geoId !== 'au' && countrySwitcherProps.countryGroupIds.length > 1;

	/**
	 * Non-AU Students have ratePlanKey as OneYearStudent
	 * AU Students have ratePlanKey as Monthly, productKey as SupporterPlus and promoCode UTS_STUDENT
	 */
	const countryId: IsoCountry = Country.detect();
	const promotionSupporterPlus = getPromotion(
		allProductPrices.SupporterPlus,
		countryId,
		ratePlanToBillingPeriod(ratePlanKey),
	);
	const studentDiscount = getStudentDiscount(
		geoId,
		ratePlanKey,
		productKey,
		promotionSupporterPlus,
	);

	return (
		<PageScaffold
			header={
				<Header>
					{showCountrySwitcher && (
						<CountrySwitcherContainer>
							<CountryGroupSwitcher {...countrySwitcherProps} />
						</CountrySwitcherContainer>
					)}
				</Header>
			}
			footer={
				<FooterWithContents>
					<FooterLinks />
				</FooterWithContents>
			}
		>
			{studentDiscount && (
				<StudentHeader
					geoId={geoId}
					productKey={productKey}
					ratePlanKey={ratePlanKey}
					landingPageVariant={landingPageVariant}
					studentDiscount={studentDiscount}
				/>
			)}
			{faqItems && <AccordionFAQ faqItems={faqItems} />}
			{tsAndCsItem && <StudentTsAndCs tsAndCsItem={tsAndCsItem} />}
		</PageScaffold>
	);
}
