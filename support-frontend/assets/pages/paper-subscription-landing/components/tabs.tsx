// ----- Imports ----- //
import { Outset } from 'components/content/content';
import Tabs from 'components/tabs/tabs';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { paperSubsUrl } from 'helpers/urls/routes';
import { ContentDeliveryFaqBlock } from './content/deliveryTab';
import { SubsCardFaqBlock } from './content/subsCardTab';
// ----- Tabs ----- //
type TabOptions = {
	name: string;
	href: string;
	content: typeof SubsCardFaqBlock | typeof ContentDeliveryFaqBlock;
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
	isNationalDeliveryAbTestVariant: boolean;
};

// ----- Component ----- //
function PaperTabs({
	selectedTab,
	setTabAction,
	isNationalDeliveryAbTestVariant,
}: PropTypes): JSX.Element {
	/* Show Home Delivery tab first if in ab test */
	const tabOptions = isNationalDeliveryAbTestVariant
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
				content: (
					<TabContent
						setTabAction={setTabAction}
						isNationalDeliveryAbTestVariant={isNationalDeliveryAbTestVariant}
					/>
				),
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
