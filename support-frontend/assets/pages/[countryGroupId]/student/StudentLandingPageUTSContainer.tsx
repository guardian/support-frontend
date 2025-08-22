import type { IsoCountry } from '@modules/internationalisation/country';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { Country } from 'helpers/internationalisation/classes/country';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ratePlanToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import { type GeoId } from 'pages/geoIdConfig';
import StudentHeader from './components/StudentHeader';
import { universityBadge } from './components/StudentHeaderStyles';
import { getStudentDiscount } from './helpers/discountDetails';
import LogoUTS from './logos/uts';
import { StudentLandingPage } from './StudentLandingPage';

export function StudentLandingPageUTSContainer({
	landingPageVariant,
}: {
	landingPageVariant: LandingPageVariant;
}) {
	const geoId: GeoId = 'au';
	const productKey: ActiveProductKey = 'SupporterPlus';
	const ratePlanKey: ActiveRatePlanKey = 'Monthly';

	/**
	 * Non-AU Students have ratePlanKey as OneYearStudent
	 * AU Students have ratePlanKey as Monthly, productKey as SupporterPlus
	 * and optional promoCode
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
		<>
			{studentDiscount && (
				<StudentLandingPage
					geoId={geoId}
					header={
						<StudentHeader
							geoId={geoId}
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							landingPageVariant={landingPageVariant}
							studentDiscount={studentDiscount}
							headingCopy="Subscribe to fearless, independent and inspiring journalism"
							subheadingCopy={
								<>
									For a limited time, students with a valid UTS email address
									can unlock the premium experience of Guardian journalism,
									including unmetered app access
									{studentDiscount.promoDuration && (
										<>
											,{' '}
											<strong>free for {studentDiscount.promoDuration}</strong>
										</>
									)}
									.
								</>
							}
							universityBadge={
								<p css={universityBadge}>
									<LogoUTS /> <span>Special offer for UTS students</span>
								</p>
							}
						/>
					}
				/>
			)}
		</>
	);
}
