// ----- Imports ----- //
import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Block from 'components/page/block';
import Page from 'components/page/page';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import 'stylesheets/skeleton/skeleton.scss';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';
import { WeeklyHero } from './components/hero/hero';
import WeeklyProductPrices from './components/weeklyProductPrices';
import './weeklySubscriptionLanding.scss';
import type {
	WeeklyLandingPropTypes,
	WeeklyLPContentPropTypes,
} from './weeklySubscriptionLandingProps';
import { weeklyLandingProps } from './weeklySubscriptionLandingProps';

const styles = {
	closeGapAfterPageTitle: css`
		margin-top: 0;
	`,
	displayRowEvenly: css`
		${from.phablet} {
			display: flex;
			flex-direction: row;
			justify-content: space-evenly;
		}
	`,
	weeklyHeroContainerOverrides: css`
		display: flex;
	`,
};

function WeeklyLPContent({
	countryId,
	productPrices,
	promotionCopy,
	orderIsAGift,
	countryGroupId,
	pageQaId,
	header,
	giftNonGiftLink,
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
			<WeeklyHero
				orderIsAGift={orderIsAGift}
				promotionCopy={promotionCopy}
				countryGroupId={countryGroupId}
			/>
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
						{(countryGroupId === 'GBPCountries' ||
							countryGroupId === 'AUDCountries') && (
							<GiftNonGiftCta
								product="Student"
								href={getStudentBeanLink(countryGroupId)}
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

function getStudentBeanLink(countryGroupId: CountryGroupId) {
	if (countryGroupId === 'AUDCountries') {
		return routes.guardianWeeklyStudentAU;
	}
	return routes.guardianWeeklyStudentUK;
}

// ----- Render ----- //
export function WeeklyLandingPage({
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

	return (
		<WeeklyLPContent
			countryId={countryId}
			countryGroupId={countryGroupId}
			productPrices={productPrices}
			promotionCopy={sanitisedPromoCopy}
			orderIsAGift={orderIsAGift ?? false}
			participations={participations}
			pageQaId={pageQaId}
			header={<Header />}
			giftNonGiftLink={giftNonGiftLink}
		/>
	);
}

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
renderPage(<WeeklyLandingPage {...weeklyLandingProps(abParticipations)} />);
