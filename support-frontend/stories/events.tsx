import React from "react";
import { storiesOf } from "@storybook/react";
import EventsModule from "pages/digital-subscription-landing/components/events/eventsModule";
import { withKnobs } from "@storybook/addon-knobs";
import { withCenterAlignment } from "../.storybook/decorators/withCenterAlignment";
import CentredContainer from "components/containers/centredContainer";
import FullWidthContainer from "components/containers/fullWidthContainer";
const stories = storiesOf('Events', module).addDecorator(withKnobs).addDecorator(withCenterAlignment);
stories.add('Events', () => <FullWidthContainer>
    <CentredContainer>
      <EventsModule />
    </CentredContainer>
  </FullWidthContainer>);