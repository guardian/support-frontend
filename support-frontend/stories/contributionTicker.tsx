import React from "react";
import { storiesOf } from "@storybook/react";
import ContributionTicker from "components/ticker/contributionTicker";
import { withKnobs } from "@storybook/addon-knobs";
import { withCenterAlignment } from "../.storybook/decorators/withCenterAlignment";
const stories = storiesOf('Tickers', module).addDecorator(withKnobs).addDecorator(withCenterAlignment);
stories.add('Contribution ticker', () => <div style={{
  width: '100%',
  maxWidth: '500px'
}}>
    <ContributionTicker tickerCountType="people" onGoalReached={() => {}} tickerEndType="unlimited" currencySymbol="£" copy={{
    countLabel: 'supporters in Australia',
    goalReachedPrimary: 'We\'ve hit our goal!',
    goalReachedSecondary: 'but you can still support us'
  }} />
  </div>);