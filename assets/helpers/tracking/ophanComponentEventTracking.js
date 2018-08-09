// @flow
// ----- Imports ----- //

import * as ophan from 'ophan';
import { getAbsoluteURL } from '../url';

// ----- Types ----- //

type OphanProduct =
  | 'CONTRIBUTION'
  | 'RECURRING_CONTRIBUTION'
  | 'MEMBERSHIP_SUPPORTER'
  | 'MEMBERSHIP_PATRON'
  | 'MEMBERSHIP_PARTNER'
  | 'DIGITAL_SUBSCRIPTION'
  | 'PRINT_SUBSCRIPTION';

type OphanAction =
  | 'INSERT'
  | 'VIEW'
  | 'EXPAND'
  | 'LIKE'
  | 'DISLIKE'
  | 'SUBSCRIBE'
  | 'ANSWER'
  | 'VOTE'
  | 'CLICK';

type OphanComponentType =
  | 'READERS_QUESTIONS_ATOM'
  | 'QANDA_ATOM'
  | 'PROFILE_ATOM'
  | 'GUIDE_ATOM'
  | 'TIMELINE_ATOM'
  | 'NEWSLETTER_SUBSCRIPTION'
  | 'SURVEYS_QUESTIONS'
  | 'ACQUISITIONS_EPIC'
  | 'ACQUISITIONS_ENGAGEMENT_BANNER'
  | 'ACQUISITIONS_THANK_YOU_EPIC'
  | 'ACQUISITIONS_HEADER'
  | 'ACQUISITIONS_FOOTER'
  | 'ACQUISITIONS_INTERACTIVE_SLICE'
  | 'ACQUISITIONS_NUGGET'
  | 'ACQUISITIONS_STANDFIRST'
  | 'ACQUISITIONS_THRASHER'
  | 'ACQUISITIONS_EDITORIAL_LINK'
  | 'ACQUISITIONS_BUTTON'
  | 'ACQUISITIONS_OTHER';

type OphanComponent = {
  componentType: OphanComponentType,
  id?: string,
  products?: $ReadOnlyArray<OphanProduct>,
  campaignCode?: string,
  labels?: $ReadOnlyArray<string>
};

export type OphanComponentEvent = {
  component: OphanComponent,
  action: OphanAction,
  value?: string,
  id?: string,
  abTest?: {
    name: string,
    variant: string
  }
};

// ----- Functions ----- //

const trackComponentEvents = (componentEvent: OphanComponentEvent) => {
  ophan.record({
    componentEvent,
  });
};

function pageView(currentRoute: string, referringRoute: string) {
  try {
    ophan.sendInitialEvent(
      getAbsoluteURL(currentRoute),
      getAbsoluteURL(referringRoute),
    );
  } catch (e) {
    console.log(`Error in Ophan tracking: ${e}`);
  }
}

export {
  trackComponentEvents,
  pageView,
};
