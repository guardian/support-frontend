// @flow
// ----- Imports ----- //

import * as ophan from 'ophan';
import type { Participations, TestId } from 'helpers/abTests/abtest';
import { optimizeIdToTestName } from 'helpers/tracking/acquisitions';
import type { OptimizeExperiment, OptimizeExperiments } from 'helpers/optimize/optimize';
import { readExperimentsFromSession } from 'helpers/optimize/optimize';
import { doNotTrack, maybeTrack } from 'helpers/tracking/doNotTrack';

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
  (doNotTrack() ? null : ophan.record({ componentEvent }));

function pageView(url: string, referrer: string) {
  try {
    maybeTrack(() => ophan.sendInitialEvent(url, referrer));
  } catch (e) {
    console.log(`Error in Ophan tracking: ${e}`);
  }
}

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

const trackNativeABTests = (participations: Participations): void =>
  maybeTrack(() => ophan.record({
    abTestRegister: buildOphanPayload(participations),
  }));

const optimizeExperimentToParticipation = (exp: OptimizeExperiment) =>
  ({ [optimizeIdToTestName(exp.id)]: exp.variant });

function mergeTestTypes(participations: Participations, optimizeExperiments: OptimizeExperiments): Participations {
  const reducer = (acc, exp) => (Object.assign(acc, optimizeExperimentToParticipation(exp)));
  return optimizeExperiments.reduce(reducer, participations);
}

const trackAllABTests = (optimizeExperiments: OptimizeExperiments, participations: Participations) =>
  trackNativeABTests(mergeTestTypes(participations, optimizeExperiments));

const trackAbTests = (participations: Participations) => trackAllABTests(readExperimentsFromSession(), participations);

function trackNewOptimizeExperiment(exp: OptimizeExperiment, participations: Participations) {
  const allOptimizeExperiments = readExperimentsFromSession();
  allOptimizeExperiments.push(exp);
  trackAllABTests(allOptimizeExperiments, participations);
}

export {
  trackComponentEvents,
  pageView,
  trackAbTests,
  trackNewOptimizeExperiment,
};
