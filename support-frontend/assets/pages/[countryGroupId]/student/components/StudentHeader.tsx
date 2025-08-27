import GridPicture from 'components/gridPicture/gridPicture';
import { Container } from 'components/layout/container';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import buildCheckoutUrl from '../helpers/buildCheckoutUrl';
import type { StudentDiscount } from '../helpers/discountDetails';
import {
	cardContainer,
	containerCardsAndSignIn,
	heading,
	headingWrapper,
	subHeading,
} from './StudentHeaderStyles';
import StudentPrice from './StudentPrice';
import StudentProductCard from './StudentProductCard';

interface StudentHeaderProps {
	geoId: GeoId;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	landingPageVariant: LandingPageVariant;
	studentDiscount: StudentDiscount;
	headingCopy: string;
	subheadingCopy: React.ReactNode;
	universityBadge?: JSX.Element;
}

export default function StudentHeader({
	geoId,
	productKey,
	ratePlanKey,
	landingPageVariant,
	studentDiscount,
	headingCopy,
	subheadingCopy,
	universityBadge,
}: StudentHeaderProps) {
	const { amount, promoCode, discountSummary } = studentDiscount;
	const { benefits } = landingPageVariant.products.SupporterPlus;
	const checkoutUrl = buildCheckoutUrl(
		geoId,
		productKey,
		ratePlanKey,
		promoCode,
	);

	const ctaLabel = amount === 0 ? 'Sign up for free' : 'Subscribe';

	return (
		<Container
			sideBorders
			topBorder
			borderColor="rgba(170, 170, 180, 0.5)"
			cssOverrides={containerCardsAndSignIn}
		>
			{universityBadge}
			<div css={headingWrapper}>
				<h1 css={heading}>{headingCopy}</h1>
				<p css={subHeading}>{subheadingCopy}</p>
			</div>
			<div css={cardContainer}>
				<StudentProductCard
					price={<StudentPrice studentDiscount={studentDiscount} />}
					benefitsList={benefits}
					ctaUrl={checkoutUrl}
					ctaLabel={ctaLabel}
					discountSummary={discountSummary}
				/>
				<GridPicture
					sources={[
						{
							gridId: 'AuStudentLandingHeroMobile',
							srcSizes: [2000, 1000, 500],
							sizes: '350px',
							imgType: 'jpg',
							media: '(max-width: 739px)',
						},
						{
							gridId: 'AuStudentLandingHeroTablet',
							srcSizes: [1396, 855, 428],
							sizes: '350px',
							imgType: 'jpg',
							media: '(max-width: 979px)',
						},
						{
							gridId: 'AuStudentLandingHeroDesktop',
							srcSizes: [2000, 1000, 500],
							sizes: '574px',
							imgType: 'jpg',
							media: '(min-width: 980px)',
						},
					]}
					fallback="AuStudentLandingHeroDesktop"
					fallbackSize={574}
					altText=""
				/>
			</div>
		</Container>
	);
}
