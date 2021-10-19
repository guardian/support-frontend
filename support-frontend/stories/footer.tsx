import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { withVerticalCenterAlignment } from "../.storybook/decorators/withCenterAlignment";
import CentredContainer from "components/containers/centredContainer";
import FullWidthContainer from "components/containers/fullWidthContainer";
import Footer from "components/footerCompliant/Footer";
const stories = storiesOf('Footer', module).addDecorator(withKnobs).addDecorator(withVerticalCenterAlignment);
stories.add('Footer', () => {
  const contents = boolean('Show contents', true);
  return <FullWidthContainer theme="brand">
      <CentredContainer>
        <Footer termsConditionsLink="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
          {contents && <>
            Terms and conditions may (or may not) apply
          </>}
        </Footer>
      </CentredContainer>
    </FullWidthContainer>;
});