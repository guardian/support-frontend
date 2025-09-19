import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import GridPicture from 'components/gridPicture/gridPicture';
import { Container } from 'components/layout/container';
import type {
	LandingPageVariant,
	ProductBenefit,
} from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import buildCheckoutUrl from '../helpers/buildCheckoutUrl';
import type { StudentDiscount } from '../helpers/discountDetails';
import {
	cardContainer,
	containerCardsAndSignIn,
	heading,
	headingWrapper,
	notAStudentContainer,
	subHeading,
} from './StudentHeaderStyles';
import StudentPrice from './StudentPrice';
import StudentProductCard from './StudentProductCard';

interface StudentHeaderProps {
	supportRegionId: SupportRegionId;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	landingPageVariant: LandingPageVariant;
	studentDiscount: StudentDiscount;
	headingCopy: React.ReactNode;
	subheadingCopy: React.ReactNode;
	universityBadge?: JSX.Element;
	includeThreeTierLink?: boolean;
	heroImagePrefix: string;
}

export const ukSpecificAdditionalBenefit: ProductBenefit = {
	copy: 'Student-focused newsletter, curated by our journalists',
	label: {
		copy: 'Limited series',
	},
	tooltip:
		'Each week, hear from our journalists about topics that matter to you — including AI, politics, climate and more.',
};

export default function StudentHeader({
	supportRegionId,
	productKey,
	ratePlanKey,
	landingPageVariant,
	studentDiscount,
	headingCopy,
	subheadingCopy,
	universityBadge,
	includeThreeTierLink = false,
	heroImagePrefix,
}: StudentHeaderProps) {
	const { amount, promoCode, discountSummary } = studentDiscount;
	const checkoutUrl = buildCheckoutUrl(
		supportRegionId,
		productKey,
		ratePlanKey,
		promoCode,
	);

	// In the UK on this page only, add an additional benefit to the list
	const { benefits: configuredBenefits } =
		landingPageVariant.products.SupporterPlus;

	const benefits =
		supportRegionId === SupportRegionId.UK
			? [ukSpecificAdditionalBenefit, ...configuredBenefits]
			: configuredBenefits;

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
							gridId: `${heroImagePrefix}Mobile`,
							srcSizes: [2000, 1000, 500],
							sizes: '719px',
							imgType: 'jpg',
							media: '(max-width: 739px)',
						},
						{
							gridId: `${heroImagePrefix}Tablet`,
							srcSizes: [1396, 855, 428],
							sizes: '350px',
							imgType: 'jpg',
							media: '(max-width: 979px)',
						},
						{
							gridId: `${heroImagePrefix}Desktop`,
							srcSizes: [2000, 1000, 500],
							sizes: '574px',
							imgType: 'jpg',
							media: '(min-width: 980px)',
						},
					]}
					fallback={`${heroImagePrefix}Desktop`}
					fallbackSize={574}
					altText=""
				/>
			</div>
			{includeThreeTierLink && (
				<div css={notAStudentContainer}>
					<p>
						<span>Not a student?</span>{' '}
						<span>
							Explore our other{' '}
							<a href={`/${supportRegionId}/contribute`}>support options</a>
						</span>
					</p>
				</div>
			)}
		</Container>
	);
}
