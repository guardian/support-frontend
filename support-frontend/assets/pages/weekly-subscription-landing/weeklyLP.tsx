import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Block from 'components/page/block';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';
import { WeeklyGiftStudentSubs } from './components/weeklyGiftStudentSubs';
import WeeklyProductPrices from './components/weeklyProductPrices';

const weeklyGiftPadding = css`
	background-color: white;
	section {
		padding: ${space[3]}px ${space[3]}px ${space[12]}px;
	}
	section > div {
		margin-bottom: ${space[9]}px;
	}
	${from.phablet} {
		justify-content: space-around;
	}
`;

const styles = {
	closeGapAfterPageTitle: css`
		margin-top: 0;
	`,
};

type WeeklyLPPropTypes = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	productPrices: ProductPrices | null | undefined;
	orderIsAGift: boolean;
};

export function WeeklyLP({
	countryId,
	countryGroupId,
	productPrices,
	orderIsAGift,
}: WeeklyLPPropTypes): JSX.Element {
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
			<WeeklyGiftStudentSubs
				countryGroupId={countryGroupId}
				orderIsAGift={orderIsAGift}
				cssOverrides={weeklyGiftPadding}
			/>
		</>
	);
}
