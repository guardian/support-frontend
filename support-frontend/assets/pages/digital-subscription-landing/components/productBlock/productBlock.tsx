/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import AdFreeSection from 'components/adFreeSection/adFreeSection';
import GridPicture from 'components/gridPicture/gridPicture';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import { ListHeading } from 'components/productPage/productPageList/productPageList';
import BlockLabel from 'components/blockLabel/blockLabel';
import {
	Dropdown,
	ProductCard,
	ProductBlockSection,
} from './productBlockComponents';
const labelMobileMargin = css`
	margin-top: 20px;

	${from.mobileLandscape} {
		margin-top: 25px;
	}

	${from.tablet} {
		margin-top: 0;
	}
`;
const sectionLabel = css`
	${from.tablet} {
		transform: translateY(-100%);
		position: absolute;
		left: 0;
		top: 0;
	}
`;

const Plus = () => (
	<BlockLabel cssOverrides={labelMobileMargin}>+ Plus</BlockLabel>
);

const dailyImage = (
	<GridPicture
		sources={[
			{
				gridId: 'editionsRowMobile',
				srcSizes: [140, 500],
				imgType: 'png',
				sizes: '90vw',
				media: '(max-width: 739px)',
			},
			{
				gridId: 'editionsRowDesktop',
				srcSizes: [140, 500, 1000],
				imgType: 'png',
				sizes:
					'(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
				media: '(min-width: 740px)',
			},
		]}
		fallback="editionsRowDesktop"
		fallbackSize={500}
		altText=""
		fallbackImgType="png"
	/>
);
const weekendImage = (
	<GridPicture
		sources={[
			{
				gridId: 'weekendPackshotMobile',
				srcSizes: [140, 500],
				imgType: 'png',
				sizes: '90vw',
				media: '(max-width: 739px)',
			},
			{
				gridId: 'weekendPackshotDesktop',
				srcSizes: [140, 500, 1000],
				imgType: 'png',
				sizes:
					'(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
				media: '(min-width: 740px)',
			},
		]}
		fallback="weekendPackshotDesktop"
		fallbackSize={500}
		altText=""
		fallbackImgType="png"
	/>
);
const appImage = (
	<GridPicture
		sources={[
			{
				gridId: 'liveAppMobile',
				srcSizes: [140, 500],
				imgType: 'png',
				sizes: '90vw',
				media: '(max-width: 739px)',
			},
			{
				gridId: 'liveAppDesktop',
				srcSizes: [140, 500, 1000],
				imgType: 'png',
				sizes:
					'(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
				media: '(min-width: 740px)',
			},
		]}
		fallback="liveAppDesktop"
		fallbackSize={500}
		altText=""
		fallbackImgType="png"
	/>
);
type ProductSectionPropTypes = {
	first: boolean;
	second: boolean;
};

const DailyProductBlockSection = ({
	first,
	second,
}: ProductSectionPropTypes) => (
	<ProductBlockSection
		product="Daily"
		render={(showDropDown) => (
			<>
				<ProductCard
					title="UK Daily in the Guardian Editions app"
					subtitle="Each day's edition, in one simple, elegant app"
					image={dailyImage}
					first={first}
					second={second}
				/>
				<Dropdown showDropDown={showDropDown} product="Daily">
					<ListHeading
						items={[
							{
								boldText: 'A new way to read',
								explainer: 'The newspaper, reimagined for mobile and tablet',
							},
							{
								boldText: 'Published daily',
								explainer:
									'Each edition available to read by 6am (GMT), 7 days a week',
							},
							{
								boldText: 'Easy to navigate',
								explainer:
									'Read the complete edition, or swipe to the sections you care about',
							},
						]}
					/>
					<ListHeading
						items={[
							{
								boldText: 'Multiple devices',
								explainer:
									'Beautifully designed for your mobile or tablet on iOS and Android',
							},
							{
								boldText: 'Read offline',
								explainer: 'Download and read whenever it suits you',
							},
							{
								boldText: 'Ad-free',
								explainer:
									'Enjoy our journalism uninterrupted, without adverts',
							},
							{
								boldText: 'Enjoy our other editions',
								explainer:
									'Australia Weekend and other special editions are all included in the Guardian Editions app as part of your subscription',
							},
						]}
					/>
				</Dropdown>
			</>
		)}
	/>
);

const DailyProductBlockSectionAus = ({
	first,
	second,
}: ProductSectionPropTypes) => (
	<ProductBlockSection
		product="Daily"
		render={(showDropDown) => (
			<>
				<ProductCard
					title="Australia Weekend in the Guardian Editions app"
					subtitle="Everything you need to make sense of the week, in one simple, elegant app"
					image={weekendImage}
					first={first}
					second={second}
					secondImage={false}
				/>
				<Dropdown showDropDown={showDropDown} product="Daily">
					<ListHeading
						items={[
							{
								boldText: 'A new way to read',
								explainer:
									'The weekend paper, reimagined for mobile and tablet. Each new edition available to read Saturday at 6am (AEST)',
							},
							{
								boldText: 'Start your weekend informed',
								explainer:
									'Enjoy early access to the best journalism planned for the weekend',
							},
							{
								boldText: 'Easy to navigate',
								explainer:
									'Read the complete edition, or swipe to the sections you care about',
							},
							{
								boldText: 'Read offline',
								explainer: 'Download and read whenever it suits you',
							},
						]}
					/>
					<ListHeading
						items={[
							{
								boldText: 'Ad-free',
								explainer:
									'Enjoy our journalism uninterrupted, without adverts',
							},
							{
								boldText: 'Multiple devices',
								explainer:
									'Beautifully designed for your mobile or tablet on iOS and Android',
							},
							{
								boldText: 'Enjoy our other editions',
								explainer:
									'The UK Daily and other special editions are all included in the Guardian Editions app as part of your subscription',
							},
						]}
					/>
				</Dropdown>
			</>
		)}
	/>
);

const PremiumAppProductBlockSection = ({
	first,
	second,
}: ProductSectionPropTypes) => (
	<ProductBlockSection
		product="App"
		render={(showDropDown) => (
			<>
				<ProductCard
					title="Premium access to the Guardian Live app"
					subtitle="Live news, as it happens"
					image={appImage}
					first={first}
					second={second}
				/>
				<Dropdown showDropDown={showDropDown} product="App">
					<ListHeading
						items={[
							{
								boldText: 'Live',
								explainer:
									'Follow a live feed of breaking news and sport, as it happens',
							},
							{
								boldText: 'Discover',
								explainer:
									'Explore stories you might have missed, tailored to you',
							},
							{
								boldText: 'Enhanced offline reading',
								explainer: 'Download the news whenever it suits you',
							},
						]}
					/>
					<ListHeading
						items={[
							{
								boldText: 'Daily Crossword',
								explainer: 'Play the daily crossword wherever you are',
							},
							{
								boldText: 'Ad-free',
								explainer:
									'Enjoy our journalism uninterrupted, without adverts',
							},
						]}
					/>
				</Dropdown>
			</>
		)}
	/>
);

type PropTypes = {
	countryGroupId: CountryGroupId;
};

function getProductOrderForCountryGroup(countryGroupId: CountryGroupId) {
	switch (countryGroupId) {
		case 'UnitedStates':
			return [
				PremiumAppProductBlockSection,
				DailyProductBlockSection,
				AdFreeSection,
			];

		case 'AUDCountries':
			return [
				DailyProductBlockSectionAus,
				PremiumAppProductBlockSection,
				AdFreeSection,
			];

		default:
			return [
				DailyProductBlockSection,
				PremiumAppProductBlockSection,
				AdFreeSection,
			];
	}
}

function ProductBlock({ countryGroupId }: PropTypes) {
	const contentOrder = getProductOrderForCountryGroup(countryGroupId);
	return (
		<div className="hope-is-power__products">
			<BlockLabel tag="h2" cssOverrides={sectionLabel}>
				What&apos;s included?
			</BlockLabel>
			<section className="product-block__container hope-is-power--centered">
				{contentOrder.map((ProductSection, index) => (
					<>
						<ProductSection first={index === 0} second={index === 1} />
						{index < contentOrder.length - 1 ? <Plus /> : null}
					</>
				))}
			</section>
		</div>
	);
}

export default ProductBlock;
