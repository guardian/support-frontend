import { SvgInfoRound } from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Carousel from 'components/product/Carousel';
import { type Product } from 'components/product/productOption';
import Tabs, { type TabProps } from 'components/tabs/tabs';
import { observerLinks } from 'helpers/legal';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import NewspaperRatePlanCard from 'pages/paper-subscription-landing/components/NewspaperRatePlanCard';
import { getPlans } from '../helpers/getPlans';
import NewspaperTabHero from './content/NewspaperTabHero';
import {
	cardsContainer,
	productInfoWrapper,
} from './NewspapperProductTabsStyles';

type TabOptions = {
	text: string;
	href: string;
	content: () => ReactElement;
};

const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
	HomeDelivery: {
		text: 'Home Delivery',
		href: `#${HomeDelivery}`,
		content: () => <NewspaperTabHero tab={HomeDelivery} />,
	},
	Collection: {
		text: 'Subscription Card',
		href: `#${Collection}`,
		content: () => <NewspaperTabHero tab={Collection} />,
	},
};

function NewspaperProductTabs({
	productPrices,
}: {
	productPrices: ProductPrices;
}) {
	const fulfilment =
		window.location.hash === `#${Collection}` ? Collection : HomeDelivery;

	const [selectedTab, setSelectedTab] =
		useState<PaperFulfilmentOptions>(fulfilment);

	const { windowWidthIsGreaterThan } = useWindowWidth();
	const [productRatePlans, setProductRatePlans] = useState<Product[]>(
		getPlans(selectedTab, productPrices),
	);

	useEffect(() => {
		setProductRatePlans(getPlans(selectedTab, productPrices));
	}, [selectedTab]);

	const tabItems = Object.entries(tabs).map(([fulfilment, tab]) => {
		const { href, text, content: ContentComponent } = tab;
		return {
			id: fulfilment,
			text,
			href,
			selected: fulfilment === selectedTab,
			content: <ContentComponent />,
		} as TabProps;
	});

	const renderProducts = () =>
		productRatePlans.map((product) => <NewspaperRatePlanCard {...product} />);

	return (
		<FullWidthContainer>
			<CentredContainer>
				<Tabs
					tabsLabel="Paper subscription options"
					tabElement="a"
					tabs={tabItems}
					onTabChange={(tabId) => {
						setSelectedTab(tabId);
					}}
					theme="paperTabs"
				/>
				<section css={cardsContainer}>
					{windowWidthIsGreaterThan('tablet') ? (
						<Carousel items={renderProducts()} />
					) : (
						renderProducts()
					)}
				</section>
				<div css={productInfoWrapper}>
					<SvgInfoRound size="medium" />
					<p>
						{selectedTab === HomeDelivery && 'Delivery is included. '}
						You can cancel your subscription at any time. Sunday only
						subscriptions for The Observer are offered by Tortoise Media Ltd.
						Tortoise Media's{' '}
						<a href={observerLinks.TERMS}>terms and conditions</a> and{' '}
						<a href={observerLinks.PRIVACY}>privacy policy</a> will apply.
					</p>
				</div>
			</CentredContainer>
		</FullWidthContainer>
	);
}

export default NewspaperProductTabs;
