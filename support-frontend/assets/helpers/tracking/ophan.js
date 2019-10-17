// @flow
// ----- Imports ----- //

import * as ophan from 'ophan';
import type { Participations, TestId } from 'helpers/abTests/abtest';
import { maybeTrack } from 'helpers/tracking/doNotTrack';

// ----- Types ----- //

// These are to match Thrift definitions which can be found here:
// https://dashboard.ophan.co.uk/docs/thrift/componentevent.html#Struct_ComponentEvent
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

type OphanABEvent = {
  variantName: string,
  complete: boolean,
  campaignCodes?: string[],
};

type OphanABPayload = {
  [TestId]: OphanABEvent,
};

// ----- Functions ----- //

const trackComponentEvents = (componentEvent: OphanComponentEvent) =>
  maybeTrack(() => ophan.record({ componentEvent }));

const pageView = (url: string, referrer: string) =>
  maybeTrack(() => {
    try {
      ophan.sendInitialEvent(url, referrer);
    } catch (e) {
      console.log(`Error in Ophan tracking: ${e}`);
    }
  });

const buildOphanPayload = (participations: Participations): OphanABPayload =>
  Object.keys(participations)
    .reduce((payload, participation) => {
      const ophanABEvent: OphanABEvent = {
        variantName: participations[participation],
        complete: false,
        campaignCodes: [],
      };

      return Object.assign({}, payload, { [participation]: ophanABEvent });
    }, {});

const trackAbTests = (participations: Participations): void =>
  maybeTrack(() => ophan.record({
    abTestRegister: buildOphanPayload(participations),
  }));

export {
  trackComponentEvents,
  pageView,
  trackAbTests,
};
