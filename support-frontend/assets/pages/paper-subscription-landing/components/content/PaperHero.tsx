// ----- Imports ----- //
import { ThemeProvider } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import {
	buttonThemeBrand,
	LinkButton,
	SvgArrowDownStraight,
} from '@guardian/source/react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { offerStraplineBlue } from 'stylesheets/emotion/colours';
import { heroCopy, heroParagraph, heroTitle } from './PaperHeroStyles';

export type PaperHeroItems = {
	titleCopy: string | JSX.Element;
	bodyCopy: string;
	roundelCopy: string | undefined;
};

type PaperHeroPropTypes = {
	promotionCopy: PromotionCopy;
	paperHeroItems: PaperHeroItems;
};

export function PaperHero({
	promotionCopy,
	paperHeroItems,
}: PaperHeroPropTypes): JSX.Element | null {
	const title = promotionCopy.title ?? paperHeroItems.titleCopy;
	const body =
		promotionHTML(promotionCopy.description, {
			tag: 'p',
		}) ?? paperHeroItems.bodyCopy;
	const roundel = promotionCopy.roundel ?? paperHeroItems.roundelCopy;

	return (
		<PageTitle title="Newspaper subscription" theme="paper">
			<CentredContainer>
				<OfferStrapline
					fgCol={palette.neutral[7]}
					bgCol={offerStraplineBlue}
					copy={roundel}
				/>
				<Hero
					image={
						<GridImage
							gridId="printCampaignWithObserverHeroHD"
							srcSizes={[1000, 500, 140]}
							sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
							imgType="png"
							altText="Newspapers"
						/>
					}
					hideRoundelBelow="mobileMedium"
					roundelElement={undefined}
				>
					<section css={heroCopy}>
						<h2 css={heroTitle}>{title}</h2>
						<p css={heroParagraph}>{body}</p>
						<ThemeProvider theme={buttonThemeBrand}>
							<LinkButton
								onClick={sendTrackingEventsOnClick({
									id: 'options_cta_click',
									product: 'Paper',
									componentType: 'ACQUISITIONS_BUTTON',
								})}
								priority="tertiary"
								iconSide="right"
								icon={<SvgArrowDownStraight />}
								href="#HomeDelivery"
							>
								See pricing options
							</LinkButton>
						</ThemeProvider>
					</section>
				</Hero>
			</CentredContainer>
		</PageTitle>
	);
}
