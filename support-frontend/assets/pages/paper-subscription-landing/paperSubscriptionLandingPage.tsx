// ----- Imports ----- //

import { css } from '@emotion/react';
import { between, space } from '@guardian/source/foundations';
import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import { useState } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import Block from 'components/page/block';
import Page from 'components/page/page';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { renderPage } from 'helpers/rendering/render';
import { PaperHero } from './components/hero/hero';
import PaperProductPrices from './components/paperProductPrices';
import PaperProductTabs from './components/paperProductTabs';
import PaperTabs from './components/paperTabs';
import { displayPaperProductTabs } from './helpers/displayPaperProductTabs';
import type { PaperLandingPropTypes } from './paperSubscriptionLandingProps';
import { paperLandingProps } from './paperSubscriptionLandingProps';
import 'stylesheets/skeleton/skeleton.scss';
import './paperSubscriptionLanding.scss';

// ----- Redux Store ----- //

const paperSubsFooter = (
	<Footer termsConditionsLink="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions" />
);

// ----- Render ----- //

const tabsTabletSpacing = css`
	${between.tablet.and.leftCol} {
		padding: 0 ${space[5]}px;
	}
`;

// ID for Selenium tests
const pageQaId = 'qa-paper-subscriptions';

function PaperLandingPage({
	productPrices,
	promotionCopy,
}: PaperLandingPropTypes) {
	const sanitisedPromoCopy = getPromotionCopy(promotionCopy);

	const fulfilment =
		window.location.hash === `#${Collection}` ? Collection : HomeDelivery;

	const [selectedTab, setSelectedTab] =
		useState<PaperFulfilmentOptions>(fulfilment);

	if (!productPrices) {
		return null;
	}

	function handleSetTabAction(newTab: PaperFulfilmentOptions) {
		setSelectedTab(newTab);
		sendTrackingEventsOnClick({
			id: `Paper_${newTab}-tab`,
			// eg. Paper_Collection-tab or Paper_HomeDelivery-tab
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		})();

		window.history.replaceState({}, '', `#${newTab}`);
	}

	const showPaperProductTabs = displayPaperProductTabs();

	return (
		<Page
			id={pageQaId}
			header={<Header countryGroupId={GBPCountries} />}
			footer={paperSubsFooter}
		>
			<PaperHero
				productPrices={productPrices}
				promotionCopy={sanitisedPromoCopy}
			/>
			{showPaperProductTabs ? (
				<PaperProductTabs />
			) : (
				<>
					<FullWidthContainer>
						<CentredContainer>
							<Block>
								<div css={tabsTabletSpacing}>
									<PaperTabs
										selectedTab={selectedTab}
										setTabAction={handleSetTabAction}
									/>
								</div>
							</Block>
						</CentredContainer>
					</FullWidthContainer>
					<FullWidthContainer theme="dark" hasOverlap>
						<CentredContainer>
							<PaperProductPrices
								productPrices={productPrices}
								tab={selectedTab}
								setTabAction={handleSetTabAction}
							/>
						</CentredContainer>
					</FullWidthContainer>
				</>
			)}
		</Page>
	);
}

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
const content = <PaperLandingPage {...paperLandingProps(abParticipations)} />;
renderPage(content);
export { content };
