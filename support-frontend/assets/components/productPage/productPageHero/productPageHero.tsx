// ----- Imports ----- //
import type { ReactNode } from 'react';
import React from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import type { Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import 'helpers/types/option';
import './productPageHero.scss';

// ---- Types ----- //
type WrapperPropTypes = {
	children: ReactNode;
	modifierClasses: Array<string | null | undefined>;
	className: string | null | undefined;
	appearance: 'grey' | 'feature' | 'custom' | 'campaign';
};
type PropTypes = WrapperPropTypes & {
	overheading: string;
	heading: string | ReactNode;
	content?: Option<ReactNode>;
	hasCampaign: boolean;
	showProductPageHeroHeader?: boolean;
	orderIsAGift?: boolean;
	giftImage?: ReactNode;
};
type ProductPageHeroHeaderTypes = {
	overheading: string;
	hasCampaign: boolean;
	heading: string | ReactNode;
	orderIsAGift?: boolean;
	giftImage?: ReactNode;
};

// ----- Render ----- //
function HeroWrapper({
	modifierClasses,
	children,
	appearance,
	className,
}: WrapperPropTypes): JSX.Element {
	return (
		<div
			className={`${className ?? ''} ${classNameWithModifiers(
				'component-product-page-hero',
				[...modifierClasses, appearance],
			)}`}
		>
			<LeftMarginSection>{children}</LeftMarginSection>
		</div>
	);
}

HeroWrapper.defaultProps = {
	modifierClasses: [],
	appearance: 'grey',
	className: null,
};

function HeroHeading({
	children,
	hasCampaign,
	orderIsAGift,
	giftImage,
}: {
	children: ReactNode;
	hasCampaign: boolean;
	orderIsAGift?: boolean;
	giftImage?: ReactNode;
}): JSX.Element {
	return (
		<div
			className={classNameWithModifiers('component-product-page-hero-heading', [
				hasCampaign ? 'campaign' : null,
			])}
		>
			<LeftMarginSection>
				{orderIsAGift && giftImage}
				{children}
			</LeftMarginSection>
		</div>
	);
}

HeroHeading.defaultProps = {
	orderIsAGift: false,
	giftImage: null,
};

function ProductPageHero({
	modifierClasses,
	children,
	appearance,
	showProductPageHeroHeader,
	...props
}: PropTypes): JSX.Element {
	return (
		<header>
			<HeroWrapper
				{...{
					modifierClasses,
					appearance,
				}}
			>
				{children}
			</HeroWrapper>
			{showProductPageHeroHeader && <ProductPageHeroHeader {...props} />}
		</header>
	);
}

function ProductPageHeroHeader({
	overheading,
	heading,
	hasCampaign,
	orderIsAGift,
	giftImage,
}: ProductPageHeroHeaderTypes): JSX.Element {
	return (
		<div>
			<HeroHeading
				{...{
					hasCampaign,
					orderIsAGift,
					giftImage,
				}}
			>
				<HeadingBlock
					overheading={
						orderIsAGift ? 'The Guardian Weekly gift subscription' : overheading
					}
					orderIsAGift={orderIsAGift}
				>
					{heading}
				</HeadingBlock>
			</HeroHeading>
		</div>
	);
}

ProductPageHero.defaultProps = {
	children: null,
	...HeroWrapper.defaultProps,
	showProductPageHeroHeader: true,
};
ProductPageHeroHeader.defaultProps = {
	orderIsAGift: false,
	giftImage: null,
};
export { HeroWrapper, HeroHeading, ProductPageHeroHeader };
export default ProductPageHero;
