import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Block from 'components/page/block';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { routes } from 'helpers/urls/routes';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';
import WeeklyProductPrices from './components/weeklyProductPrices';

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

type WeeklyLPPropTypes = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	productPrices: ProductPrices | null | undefined;
	orderIsAGift: boolean;
};

function getStudentBeanLink(countryGroupId: CountryGroupId) {
	if (countryGroupId === 'AUDCountries') {
		return routes.guardianWeeklyStudentAU;
	}
	return routes.guardianWeeklyStudentUK;
}

export function WeeklyLP({
	countryId,
	countryGroupId,
	productPrices,
	orderIsAGift,
}: WeeklyLPPropTypes): JSX.Element {
	const giftNonGiftLink = orderIsAGift
		? routes.guardianWeeklySubscriptionLanding
		: routes.guardianWeeklySubscriptionLandingGift;
	return (
		<>
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
		</>
	);
}
