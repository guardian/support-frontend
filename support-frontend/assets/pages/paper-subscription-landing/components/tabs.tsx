// ----- Imports ----- //
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Outset } from "components/content/content";
import Tabs from "components/tabs/tabs";
import { paperSubsUrl } from "helpers/routes";
import { type State } from "../paperSubscriptionLandingPageReducer";
import { setTab, type TabActions } from "../paperSubscriptionLandingPageActions";
import type { PaperFulfilmentOptions } from "helpers/productPrice/fulfilmentOptions";
import { SubsCardFaqBlock } from "./content/subsCardTab";
import { ContentDeliveryFaqBlock } from "./content/deliveryTab";
// ----- Tabs ----- //
type TabOptions = {
  name: string;
  href: string;
  content: (args: any) => React.ReactElement<React.ComponentProps<(props: any) => React.ReactElement<React.ComponentProps<"div">, "div">>, (props: any) => React.ReactElement<React.ComponentProps<"div">, "div">>;
};
export const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
  Collection: {
    name: 'Subscription Card',
    href: paperSubsUrl(false),
    content: SubsCardFaqBlock
  },
  HomeDelivery: {
    name: 'Home Delivery',
    href: paperSubsUrl(true),
    content: ContentDeliveryFaqBlock
  }
};
type StatePropTypes = {
  selectedTab: PaperFulfilmentOptions;
};
type DispatchPropTypes = {
  setTabAction: (arg0: PaperFulfilmentOptions) => TabActions;
};
type PropTypes = StatePropTypes & DispatchPropTypes;

// ----- Component ----- //
function PaperTabs({
  selectedTab,
  setTabAction
}: PropTypes) {
  const tabItems = Object.keys(tabs).map(fulfilmentMethod => {
    const TabContent = tabs[fulfilmentMethod].content;
    return {
      id: fulfilmentMethod,
      text: tabs[fulfilmentMethod].name,
      href: tabs[fulfilmentMethod].href,
      selected: fulfilmentMethod === selectedTab,
      content: <TabContent setTabAction={setTabAction} />
    };
  });
  return <Outset>
      <Tabs tabsLabel="Paper subscription options" tabElement="a" tabs={tabItems} onTabChange={tabId => {
      const newActiveTab = (tabId as PaperFulfilmentOptions);
      setTabAction(newActiveTab);
    }} />
    </Outset>;
}

// ----- State/Props Maps ----- //
const mapStateToProps = (state: State) => ({
  selectedTab: state.page.tab
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) => ({
  setTabAction: bindActionCreators(setTab, dispatch)
}); // ----- Exports ----- //


export default connect(mapStateToProps, mapDispatchToProps)(PaperTabs);