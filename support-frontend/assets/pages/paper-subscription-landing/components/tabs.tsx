// ----- Imports ----- //
import * as React from 'react';
import { Outset } from 'components/content/content';
import Tabs from 'components/tabs/tabs';
import type { Participations } from 'helpers/abTests/abtest';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { paperSubsUrl } from 'helpers/urls/routes';
import { ContentDeliveryFaqBlock } from './content/deliveryTab';
import { SubsCardFaqBlock } from './content/subsCardTab';
// ----- Tabs ----- //
type TabOptions = {
	name: string;
	href: string;
	content: (
		args: any,
	) => React.ReactElement<
		React.ComponentProps<
			(props: any) => React.ReactElement<React.ComponentProps<'div'>, 'div'>
		>,
		(props: any) => React.ReactElement<React.ComponentProps<'div'>, 'div'>
	>;
};
export const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
	Collection: {
		name: 'Subscription Card',
		href: paperSubsUrl(false),
		content: SubsCardFaqBlock,
	},
	HomeDelivery: {
		name: 'Home Delivery',
		href: paperSubsUrl(true),
		content: ContentDeliveryFaqBlock,
	},
};
type PropTypes = {
	selectedTab: PaperFulfilmentOptions;
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
	participations: Participations;
};

// ----- Component ----- //
function PaperTabs({
	selectedTab,
	setTabAction,
	participations,
}: PropTypes): JSX.Element {
	/* Show Home Delivery tab first if in ab test */
	const tabOptions =
		participations.nationalDelivery === 'variant'
			? Object.keys(tabs).reverse()
			: Object.keys(tabs);
	const tabItems = (tabOptions as PaperFulfilmentOptions[]).map(
		(fulfilmentMethod) => {
			const TabContent = tabs[fulfilmentMethod].content;
			return {
				id: fulfilmentMethod,
				text: tabs[fulfilmentMethod].name,
				href: tabs[fulfilmentMethod].href,
				selected: fulfilmentMethod === selectedTab,
				content: <TabContent setTabAction={setTabAction} />,
			};
		},
	);
	return (
		<Outset>
			<Tabs
				tabsLabel="Paper subscription options"
				tabElement="a"
				tabs={tabItems}
				onTabChange={(tabId) => {
					const newActiveTab = tabId as PaperFulfilmentOptions;
					setTabAction(newActiveTab);
				}}
			/>
		</Outset>
	);
} // ----- Exports ----- //

export default PaperTabs;
