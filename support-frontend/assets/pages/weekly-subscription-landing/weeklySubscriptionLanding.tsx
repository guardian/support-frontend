// ----- Imports ----- //
import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Block from 'components/page/block';
import Page from 'components/page/page';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	detect,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import 'stylesheets/skeleton/skeleton.scss';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';
import ProductInfo from './components/content/productInfo';
import { PriceCardsWeeklyHero, WeeklyHero } from './components/hero/hero';
import WeeklyProductPrices from './components/weeklyProductPrices';
import './weeklySubscriptionLanding.scss';
import type {
	WeeklyLandingPropTypes,
	WeeklyLPContentPropTypes,
} from './weeklySubscriptionLandingProps';
import { weeklyLandingProps } from './weeklySubscriptionLandingProps';

const countryGroupId: CountryGroupId = detect();

const reactElementId: Record<CountryGroupId, string> = {
	GBPCountries: 'weekly-landing-page-uk',
	UnitedStates: 'weekly-landing-page-us',
	AUDCountries: 'weekly-landing-page-au',
	NZDCountries: 'weekly-landing-page-nz',
	EURCountries: 'weekly-landing-page-eu',
	Canada: 'weekly-landing-page-ca',
	International: 'weekly-landing-page-int',
};

const styles = {
	closeGapAfterPageTitle: css`
		margin-top: 0;
	`,
	displayRowEvenly: css`
		${from.phablet} {
			display: flex;
			flex-direction: row;
			justify-content: space-evenly:
		}
	`,
	weeklyHeroContainerOverrides: css`
		display: flex;
	`,
};

function WeeklyLPControl({
	countryId,
	productPrices,
	promotionCopy,
	orderIsAGift,
	countryGroupId,
	pageQaId,
	header,
	giftNonGiftLink,
	isPriceCardsAbTestVariant,
}: WeeklyLPContentPropTypes) {
	return (
		<Page
			id={pageQaId}
			header={header}
			footer={
				<GuardianWeeklyFooter
					productPrices={productPrices}
					orderIsAGift={!!orderIsAGift}
					country={countryId}
				/>
			}
		>
			<WeeklyHero orderIsAGift={orderIsAGift} promotionCopy={promotionCopy} />
			<FullWidthContainer>
				<CentredContainer>
					<Block cssOverrides={styles.closeGapAfterPageTitle}>
						{orderIsAGift ? <GiftBenefits /> : <Benefits />}
					</Block>
				</CentredContainer>
			</FullWidthContainer>
			<FullWidthContainer theme="dark" hasOverlap>
				<CentredContainer>
					<WeeklyProductPrices
						countryId={countryId}
						productPrices={productPrices}
						orderIsAGift={orderIsAGift}
						isPriceCardsAbTestVariant={isPriceCardsAbTestVariant ?? false}
					/>
				</CentredContainer>
			</FullWidthContainer>
			<FullWidthContainer theme="white">
				<CentredContainer>
					<div css={styles.displayRowEvenly}>
						<GiftNonGiftCta
							product="Guardian Weekly"
							href={giftNonGiftLink}
							orderIsAGift={orderIsAGift}
						/>
						{countryGroupId === 'GBPCountries' && (
							<GiftNonGiftCta
								product="Student"
								href={routes.guardianWeeklyStudent}
								orderIsAGift={orderIsAGift}
								isStudent={true}
							/>
						)}
					</div>
				</CentredContainer>
			</FullWidthContainer>
		</Page>
	);
}

function WeeklyLPVariant({
	countryId,
	productPrices,
	promotionCopy,
	orderIsAGift,
	countryGroupId,
	pageQaId,
	header,
	giftNonGiftLink,
	isPriceCardsAbTestVariant,
}: WeeklyLPContentPropTypes) {
	return (
		<Page
			id={pageQaId}
			header={header}
			footer={
				<GuardianWeeklyFooter
					productPrices={productPrices}
					orderIsAGift={!!orderIsAGift}
					country={countryId}
				/>
			}
		>
			<FullWidthContainer cssOverrides={styles.weeklyHeroContainerOverrides}>
				<PriceCardsWeeklyHero
					orderIsAGift={orderIsAGift}
					promotionCopy={promotionCopy}
					countryId={countryId}
					productPrices={productPrices}
					isPriceCardsAbTestVariant={isPriceCardsAbTestVariant ?? false}
				/>
			</FullWidthContainer>

			<FullWidthContainer>
				<CentredContainer>
					<ProductInfo
						promotionCopy={promotionCopy}
						orderIsAGift={orderIsAGift}
					/>
				</CentredContainer>
			</FullWidthContainer>

			<FullWidthContainer>
				<CentredContainer>
					<Block cssOverrides={styles.closeGapAfterPageTitle}>
						{orderIsAGift ? <GiftBenefits /> : <Benefits />}
					</Block>
				</CentredContainer>
			</FullWidthContainer>

			<FullWidthContainer theme="white">
				<CentredContainer>
					<div css={styles.displayRowEvenly}>
						<GiftNonGiftCta
							product="Guardian Weekly"
							href={giftNonGiftLink}
							orderIsAGift={orderIsAGift}
						/>
						{countryGroupId === 'GBPCountries' && (
							<GiftNonGiftCta
								product="Student"
								href={routes.guardianWeeklyStudent}
								orderIsAGift={orderIsAGift}
								isStudent={true}
							/>
						)}
					</div>
				</CentredContainer>
			</FullWidthContainer>
		</Page>
	);
}

// ----- Render ----- //
function WeeklyLandingPage({
	countryId,
	productPrices,
	promotionCopy,
	orderIsAGift,
	countryGroupId,
	participations,
}: WeeklyLandingPropTypes) {
	if (!productPrices) {
		return null;
	}

	const path = orderIsAGift
		? routes.guardianWeeklySubscriptionLandingGift
		: routes.guardianWeeklySubscriptionLanding;
	const giftNonGiftLink = orderIsAGift
		? routes.guardianWeeklySubscriptionLanding
		: routes.guardianWeeklySubscriptionLandingGift;

	const sanitisedPromoCopy = getPromotionCopy(promotionCopy, orderIsAGift);
	// ID for Selenium tests
	const pageQaId = `qa-guardian-weekly${orderIsAGift ? '-gift' : ''}`;

	const Header = headerWithCountrySwitcherContainer({
		path,
		countryGroupId,
		listOfCountryGroups: [
			GBPCountries,
			UnitedStates,
			AUDCountries,
			EURCountries,
			Canada,
			NZDCountries,
			International,
		],
		trackProduct: 'GuardianWeekly',
	});

	const isPriceCardsAbTestVariant =
		participations.guardianWeeklyPriceCards === 'variant';

	return isPriceCardsAbTestVariant ? (
		<WeeklyLPVariant
			countryId={countryId}
			countryGroupId={countryGroupId}
			productPrices={productPrices}
			promotionCopy={sanitisedPromoCopy}
			orderIsAGift={orderIsAGift ?? false}
			participations={participations}
			pageQaId={pageQaId}
			header={<Header />}
			giftNonGiftLink={giftNonGiftLink}
			isPriceCardsAbTestVariant={isPriceCardsAbTestVariant}
		/>
	) : (
		<WeeklyLPControl
			countryId={countryId}
			countryGroupId={countryGroupId}
			productPrices={productPrices}
			promotionCopy={sanitisedPromoCopy}
			orderIsAGift={orderIsAGift ?? false}
			participations={participations}
			pageQaId={pageQaId}
			header={<Header />}
			giftNonGiftLink={giftNonGiftLink}
			isPriceCardsAbTestVariant={isPriceCardsAbTestVariant}
		/>
	);
}

setUpTrackingAndConsents();
renderPage(
	<WeeklyLandingPage {...weeklyLandingProps()} />,
	reactElementId[countryGroupId],
);
